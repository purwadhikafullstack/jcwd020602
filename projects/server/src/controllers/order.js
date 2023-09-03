const db = require("../models");
const moment = require("moment");
const fs = require("fs");
const haversine = require("haversine");
const { errorResponse } = require("../utils/function");
const { CustomError, ConflictError } = require("../utils/customErrors");
const {
  getWarehouse,
  checkWarehouseSupply,
} = require("../service/warehouse.service");
const {
  findAndCountAllOrder,
  updateOrder,
  findOneOrder,
  findAndCountAllOrderUser,
} = require("../service/order.service");
const {
  findAllOrderDetail,
  addOrderDetails,
} = require("../service/orderDetail.service");
const {
  createMutation,
  confirmMutation,
} = require("../service/stockMutation.service");
const {
  findStockBy,
  findCreateStock,
  updateStock,
} = require("../service/stock.service");
const { addStockHistory } = require("../service/stockHistory.service");
const { Op, Transaction } = require("sequelize");
const path = require("path");

const generateTransactionCode = () =>
  `ORD${moment().format("YYYYMMDDHHmmss")}${Math.floor(Math.random() * 10000)}`;
const orderController = {
  addOrder: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const user_id = req.user.id;
      const warehouseData = req.closestWarehouse;
      const {
        courier,
        shipping_cost,
        total_price,
        shipping_method,
        shipping_service,
        shipping_duration,
      } = req.body;
      const address = await db.Address.findOne({
        where: { user_id, is_primary: 1 },
      });
      const addOrder = await db.Order.create(
        {
          user_id,
          courier,
          address_id: address.id,
          shipping_cost,
          shipping_service,
          shipping_method,
          shipping_duration,
          total_price: total_price,
          status: "PAYMENT",
          transaction_code: generateTransactionCode(),
          last_payment_date: moment().add(1, "days").format(),
          warehouse_id: warehouseData.id,
        },
        { transaction: t }
      );
      const cartsData = await db.Cart.findAll({
        where: { user_id },
        include: [
          {
            model: db.Shoe,
            as: "Shoes",
          },
          {
            model: db.ShoeSize,
            as: "ShoeSize",
          },
        ],
      });
      for (let i = 0; i < cartsData.length; i++) {
        let shoe_id = cartsData[i].shoe_id;
        let shoe_size_id = cartsData[i].shoe_size_id;
        let price = cartsData[i].Shoes.price;
        let qty = cartsData[i].qty;
        const [shoeStock, created] = await findCreateStock({
          warehouse_id: warehouseData.id,
          shoe_size_id,
          shoe_id,
          t,
        });
        await addOrderDetails({
          qty: qty,
          price: price,
          stock_id: shoeStock.id,
          order_id: addOrder.id,
          t,
        });
      }
      await db.Cart.destroy({ where: { user_id }, transaction: t });
      await t.commit();
      return res.status(200).send({
        message: "Success add order",
        data: addOrder,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        message: error.message,
      });
    }
  },
  getOrder: async (req, res) => {
    try {
      const warehouse_id = req.closestWarehouse.id;
      const user_id = req.user.id;
      const pageSize = 3;
      const result = await findAndCountAllOrderUser({
        warehouse_id: warehouse_id,
        user_id: user_id,
        sort: req.query?.sort || "createdAt",
        order: req.query?.order || "DESC",
        search: req.query?.search || "",
        page: req.query?.page || 1,
        status: req.query?.status,
        fromDate: req.query?.fromDate,
        toDate: req.query?.toDate,
        limit: pageSize,
      });
      return res.status(200).send({
        data: result.rows,
        totalPages: Math.ceil(result?.count / pageSize),
      });
    } catch (err) {
      errorResponse(res, err, CustomError);
    }
  },
  paymentProof: async (req, res) => {
    const t = await db.sequelize.transaction();
    const { filename } = req.file;

    try {
      const user_id = JSON.parse(req.user.id);
      const { id } = req.params;

      if (filename) {
        if (req?.order?.payment_proof) {
          try {
            fs.unlinkSync(
              path.join(__dirname, `../public/${req?.order?.payment_proof}`)
            );
          } catch (err) {
            console.log(err);
          }
        }
      }

      await db.Order.update(
        {
          payment_proof: "paymentProof/" + filename,
          status: "CONFIRM_PAYMENT",
        },
        { where: { user_id, id }, transaction: t }
      );
      await t.commit();
      return res
        .status(200)
        .send({ message: "succesfully upload payment proof" });
    } catch (err) {
      if (filename) {
        try {
          fs.unlinkSync(
            path.join(__dirname, `../public/paymentProof/${filename}`)
          );
        } catch (err) {
          console.log(err);
        }
      }
      await t.rollback();
      res.status(500).send({
        message: err.message,
      });
    }
  },
  cancelPaymentUser: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await db.Order.update(
        { status: "CANCELED" },
        { where: { id: req.order?.id }, transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: `Order successfully canceled` });
    } catch (err) {
      await t.rollback();
      errorResponse(res, err, CustomError);
    }
  },
  cancelOrderAutomatically: async () => {
    try {
      const currTime = moment().utc();
      const orders = await db.Order.findAll({
        where: { status: "PAYMENT", last_payment_date: { [Op.lte]: currTime } },
      });
      if (orders) {
        for (const order of orders) {
          await db.Order.update(
            { status: "CANCELED" },
            {
              where: { id: order?.id },
            }
          );
        }
      }
    } catch (err) {
      return err;
    }
  },
  doneOrderAutomatically: async () => {
    try {
      const currTime = moment().utc().add(-5, "minute");
      const orders = await db.Order.findAll({
        where: {
          status: "DELIVERY",
          updatedAt: { [Op.lte]: currTime },
        },
      });
      if (orders) {
        for (const order of orders) {
          await db.Order.update(
            { status: "DONE" },
            {
              where: { id: order?.id },
            }
          );
        }
      }
    } catch (err) {
      return err;
    }
  },
  getOrderAdmin: async (req, res) => {
    try {
      const warehouse = await getWarehouse({
        id: req.query?.warehouse_id || req?.user?.warehouse_id,
      });
      const result = await findAndCountAllOrder({
        warehouse_id: warehouse[0]?.dataValues?.id,
        sort: req.query?.sort || "createdAt",
        order: req.query?.order || "DESC",
        search: req.query?.search || "",
        page: req.query?.page || 1,
        status: req.query?.status,
        timeFrom: req.query?.timeFrom,
        timeTo: req.query?.timeTo,
        limit: 3,
      });
      return res
        .status(200)
        .send({ ...result, totalPages: Math.ceil(result?.count / 3) });
    } catch (err) {
      errorResponse(res, err, CustomError);
    }
  },
  confirmPayment: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await updateOrder({ t, status: req.body?.status, id: req.order?.id });
      if (req.body?.status == "PROCESSING") {
        const orderDetail = await findAllOrderDetail({
          order_id: req.order?.id,
        });
        for (const val of orderDetail) {
          const toStock = await findStockBy({
            id: val.stock.id,
          });
          if (val.stock.stock < val.qty) {
            const warehouses = await checkWarehouseSupply({
              warehouse_id: req.order.warehouse_id,
              shoe_id: val.stock.shoe_id,
              shoe_size_id: val.stock.shoe_size_id,
              qty: val.qty - val.stock.stock,
            });
            if (!warehouses?.length) {
              throw new ConflictError("Stock insuficient");
            }
            let closestWarehouse = null;
            let shortestDistance = Number.MAX_SAFE_INTEGER;
            warehouses.forEach((warehouse) => {
              const distance = haversine(
                {
                  latitude: val.stock?.warehouse?.latitude,
                  longitude: val.stock?.warehouse?.longitude,
                },
                {
                  latitude: warehouse.latitude,
                  longitude: warehouse.longitude,
                }
              );
              if (distance < shortestDistance) {
                shortestDistance = distance;
                closestWarehouse = warehouse;
              }
            });
            //stockMutation Auto
            const mutation = await createMutation({
              from_warehouse_id: closestWarehouse.id,
              to_warehouse_id: val.stock?.warehouse_id,
              qty: val.qty - val.stock?.stock,
              status: "APPROVED",
              stock_id: closestWarehouse.stocks[0].id,
              t,
            });
            // stock transfer & history
            const fromStock = await findStockBy({
              id: closestWarehouse.stocks[0].id,
            });
            fromStock.stock -= val.qty - val.stock?.stock;
            await fromStock.save({ transaction: t });
            if (fromStock.stock + val.qty != fromStock.stock) {
              await addStockHistory({
                stock_before:
                  fromStock.stock + fromStock.booked_stock + val.qty,
                stock_after: fromStock.stock + fromStock.booked_stock,
                stock_id: fromStock.id,
                reference: mutation.mutation_code,
                t,
              });
            }
            toStock.stock += val.qty - val.stock.stock;
            await toStock.save({ transaction: t });
            if (toStock.stock - val.qty != toStock.stock) {
              await addStockHistory({
                stock_before: toStock.stock + toStock.booked_stock - val.qty,
                stock_after: toStock.stock + toStock.booked_stock,
                stock_id: val.stock.id,
                reference: mutation.mutation_code,
                t,
              });
            }
          }
          toStock.stock -= val.qty;
          toStock.booked_stock += val.qty;
          await toStock.save({ transaction: t });
        }
      } else if (req?.body?.status == "PAYMENT") {
        await await db.Order.update(
          { last_payment_date: moment().add(1, "day"), payment_proof: null },
          {
            where: { id: req.order?.id },
            transaction: t,
          }
        );
        try {
          fs.unlinkSync(
            path.join(__dirname, `../public/${req.order?.payment_proof}`)
          );
        } catch (err) {
          console.log(err);
        }
      } else if (req?.body?.status == "DELIVERY") {
        const orderDetail = await findAllOrderDetail({
          order_id: req.order?.id,
        });
        for (const val of orderDetail) {
          if (val.stock.booked_stock < val.qty) {
            throw new ConflictError("Stock Insuficient");
          }
          const toStock = await findStockBy({
            id: val.stock.id,
          });
          toStock.booked_stock -= val.qty;
          await toStock.save({ transaction: t });
          if (val.stock?.stock - val.qty != val.stock?.stock) {
            await addStockHistory({
              stock_before: toStock?.stock + toStock?.booked_stock + val.qty,
              stock_after: toStock?.stock + toStock?.booked_stock,
              stock_id: val.stock?.id,
              reference: req.order?.transaction_code,
              t,
            });
          }
        }
      } else if (req?.body?.status == "CANCELED") {
        if (req.order?.status == "PROCESSING") {
          const orderDetail = await findAllOrderDetail({
            order_id: req.order?.id,
          });
          for (const val of orderDetail) {
            const toStock = await findStockBy({
              id: val.stock.id,
            });
            toStock.booked_stock -= val.qty;
            toStock.stock += val.qty;
            await toStock.save({ transaction: t });
          }
        }
      }
      await t.commit();
      return res
        .status(200)
        .send({ message: `Order is in ${req.body?.status}` });
    } catch (err) {
      await t.rollback();
      errorResponse(res, err, CustomError);
    }
  },
  getOrderById: async (req, res, next) => {
    try {
      const order = await findOneOrder({ id: req.params.id });
      if (!order) {
        return res.status(200).send({ message: "Order not found", order: {} });
      }
      req.order = order;
      next();
    } catch (err) {
      return errorResponse(res, err, CustomError);
    }
  },
  getOrderId: async (req, res) => {
    try {
      return res.status(200).send({ message: "success", order: req.order });
    } catch (err) {
      return errorResponse(res, err, CustomError);
    }
  },
  doneOrderUser: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await db.Order.update(
        { status: "DONE" },
        { where: { id: req.order?.id }, transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: `Order Completed` });
    } catch (err) {
      await t.rollback();
      errorResponse(res, err, CustomError);
    }
  },
};
module.exports = orderController;
