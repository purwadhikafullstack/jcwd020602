const db = require("../models");
const moment = require("moment");
const haversine = require("haversine");
const { errorResponse } = require("../utils/function");
const { CustomError } = require("../utils/customErrors");
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
const { createMutation } = require("../service/stockMutation.service");
const {
  findStockBy,
  findCreateStock,
  updateStock,
} = require("../service/stock.service");
const { addStockHistory } = require("../service/stockHistory.service");

const generateTransactionCode = () =>
  `ORD${moment().format("YYYYMMDDHHmmss")}${Math.floor(Math.random() * 10000)}`;
const orderController = {
  addOrder: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const user_id = req.user.id;
      const warehouseData = req.closestWarehouse;
      // console.log(warehouseData);
      // console.log(req.user);
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
      // console.log(addOrder);
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
      // console.log(cartsData);

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

        if (shoeStock.stock < qty) {
          const warehouse = await checkWarehouseSupply({
            shoe_id,
            shoe_size_id,
            qty: qty - shoeStock.stock,
          });

          // console.log(warehouse);
          if (!warehouse?.length) {
            return res.status(500).send({ message: "stock insuficient" });
          }
          let closestWarehouse = null;
          let shortestDistance = Number.MAX_SAFE_INTEGER;
          warehouse.forEach((val) => {
            const distance = haversine(
              {
                latitude: warehouseData?.latitude,
                longitude: warehouseData?.longitude,
              },
              {
                latitude: val.latitude,
                longitude: val.longitude,
              }
            );
            if (distance < shortestDistance) {
              shortestDistance = distance;
              closestWarehouse = val;
            }
          });
          // console.log(closestWarehouse.stocks);
          //stockMutation Auto
          await createMutation({
            from_warehouse_id: closestWarehouse.id,
            to_warehouse_id: warehouseData.id,
            qty: qty - shoeStock.stock,
            status: "APPROVED",
            stock_id: closestWarehouse.stocks[0].id,
            t,
          });
          // stock transfer & history
          const fromStock = await findStockBy({
            id: closestWarehouse.stocks[0].id,
          });
          // console.log(fromStock);
          fromStock.stock -= qty - shoeStock.stock;
          await fromStock.save({ transaction: t });

          if (fromStock.stock + qty != fromStock.stock) {
            await addStockHistory({
              stock_before: fromStock.stock + qty,
              stock_after: fromStock.stock,
              stock_id: fromStock.id,
              reference: addOrder.transaction_code,
              t,
            });
          }
          shoeStock.stock += qty - shoeStock.stock;
          await shoeStock.save({ transaction: t });
          if (shoeStock.stock - qty != shoeStock.stock) {
            await addStockHistory({
              stock_before: shoeStock.stock - qty,
              stock_after: shoeStock.stock,
              stock_id: shoeStock.id,
              reference: addOrder.transaction_code,
              t,
            });
          }
        }
        // console.log(shoeStock);
        await db.Stock.update(
          {
            booked_stock: shoeStock.booked_stock + qty,
            stock: shoeStock.stock - qty,
          },
          {
            where: { shoe_id, shoe_size_id, warehouse_id: warehouseData.id },
            transaction: t,
          }
        );
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
      // console.log(warehouse_id, user_id);
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
    try {
      const user_id = JSON.parse(req.user.id);
      const { id } = req.body;
      const { filename } = req.file;
      // console.log(user_id, id);
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
        {
          status: "CANCELED",
        },
        { where: { id: req.order?.id } }
      );
      const orderDetail = await findAllOrderDetail({
        order_id: req.order?.id,
      });
      for (const val of orderDetail) {
        console.log(val);
        // Decrease booked_stock in the Product table
        await updateStock({
          stock: val.stock.stock + val.qty,
          booked_stock: val.stock.booked_stock - val?.qty,
          id: val.stock_id,
          t,
        });
      }

      await t.commit();
      return res.status(200).send({ message: `Order successfully canceled` });
    } catch (err) {
      await t.rollback();
      errorResponse(res, err, CustomError);
    }
  },
  rejectPaymentProof: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await db.Order.update(
        {
          status: "PAYMENT",
          payment_proof: null,
          last_payment_date: moment().add(1, "days").format(),
        },
        { where: { id: req.order?.id } }
      );

      await t.commit();
      return res.status(200).send({ message: `Payment Proof Rejected` });
    } catch (err) {
      await t.rollback();
      errorResponse(res, err, CustomError);
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

        limit: 2,
      });
      return res
        .status(200)
        .send({ ...result, totalPages: Math.ceil(result?.count / 2) });
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
          if (val?.stock && val?.stock?.stock < val.qty) {
            const warehouse = await checkWarehouseSupply({
              shoe_id: val?.stock?.shoe_id,
              shoe_size_id: val?.stock?.shoe_size_id,
              qty: val.qty,
            });
            if (!warehouse?.length) {
              return res.status(200).send({ message: "stock insuficient" });
            }
            let closestWarehouse = null;
            let shortestDistance = Number.MAX_SAFE_INTEGER;
            warehouse.forEach((warehouse) => {
              const distance = haversine(
                {
                  latitude: val?.stock?.warehouse?.latitude,
                  longitude: val?.stock?.warehouse?.longitude,
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
            await createMutation({
              from_warehouse_id: closestWarehouse.id,
              to_warehouse_id: val.stock.warehouse_id,
              qty: val.qty - val?.stock?.stock,
              status: "APPROVED",

              stock_id: closestWarehouse.stocks[0].id,

              t,
            });
            // stock transfer & history
            const fromStock = await findStockBy({
              id: closestWarehouse.stock.id,
            });
            fromStock.stock -= val.qty;
            await fromStock.save({ transaction: t });
            const [toStock, created] = await findCreateStock({
              warehouse_id: val.stock.warehouse_id,
              shoe_id: val.stock.shoe_id,
              shoe_size_id: val.stock.shoe_size_id,
              t,
            });

            toStock.stock += val.qty;
            await toStock.save({ transaction: t });
            if (fromStock.stock + val.qty != fromStock.stock) {
              await addStockHistory({
                stock_before: fromStock.stock + stockMutation.qty,
                stock_after: fromStock.stock,
                stock_id: fromStock.id,
                reference: req?.order?.transaction_code,
                t,
              });
            }

            if (toStock.stock - val.qty != toStock.stock) {
              await addStockHistory({
                stock_before: toStock.stock - stockMutation.qty,
                stock_after: toStock.stock,
                stock_id: toStock.id,

                reference: req?.order?.transaction_code,
                t,
              });
            }
            // Decrease booked_stock in the Product table

            toStock.booked_stock = toStock.booked_stock - val.qty;
            await toStock.save({ transaction: t });
          }
        }
        await updateOrder({ t, status: "DELIVERY", id: req.order?.id });
      }
      await t.commit();
      return res
        .status(200)
        .send({ message: `Order is in ${req.body?.status}` });
    } catch (err) {
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
};
module.exports = orderController;
