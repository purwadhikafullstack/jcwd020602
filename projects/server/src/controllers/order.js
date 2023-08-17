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
} = require("../service/order.service");
const { findAllOrderDetail } = require("../service/orderDetail.service");
const { createMutation } = require("../service/stockMutation.service");
const { findStockBy, findCreateStock } = require("../service/stock.service");
const generateTransactionCode = () =>
  `ORD${moment().format("YYYYMMDDHHmmss")}${Math.floor(Math.random() * 10000)}`;
const payment_url = process.env.PAYMENT_URL;
const orderController = {
  addOrder: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { courier, shipping_cost, total_price } = req.body;
      const address = await db.Address.findOne({
        where: { user_id, is_primary: 1 },
      });
      const addOrder = await db.Order.create({
        user_id,
        courier,
        address_id: address.id,
        shipping_cost,
        total_price: total_price,
        status: "PAYMENT",
        transaction_code: generateTransactionCode(),
        last_payment_date: moment().add(1, "days").format(),
      });
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
      console.log(cartsData);

      for (let i = 0; i < cartsData.length; i++) {
        let shoe_id = cartsData[i].Shoes.id;
        let shoe_size_id = cartsData[i].ShoeSize.id;
        let qty = cartsData[i].qty;
        let shoeStock = await db.Stock.findAll({
          where: { shoe_id, shoe_size_id },
        });
        if (shoeStock.stock < qty) {
          throw new Error(
            `Insufficient quantity of product with ID ${shoe_id}.`
          );
        }
        await db.Stock.update(
          {
            booked_stock: qty,
          },
          { where: { shoe_id, shoe_size_id } }
        );
      }
      await db.Cart.destroy({ where: { user_id } });

      return res.status(200).send({
        message: "Success add order",
        data: addOrder,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  },
  getOrder: async (req, res) => {
    try {
      const user_id = req.user.id;
      const orderData = await db.Order.findOne({ where: { user_id } });

      return res.status(200).send({
        message: "Succesfully get order data",
        data: orderData,
      });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  paymentProof: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { id } = req.body;
      const { filename } = req.file;
      await db.Order.update({
        payment_proof: payment_url + filename,
        where: { user_id, id },
      });
      return res
        .status(500)
        .send({ message: "succesfully upload payment proof" });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
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
              stock_id: closestWarehouse.stock.id,
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
