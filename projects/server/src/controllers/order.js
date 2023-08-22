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
} = require("../service/order.service");
const { findAllOrderDetail } = require("../service/orderDetail.service");
const { createMutation } = require("../service/stockMutation.service");
const {
  findStockBy,
  findCreateStock,
  updateStock,
} = require("../service/stock.service");
const { addStockHistory } = require("../service/stockHistory.service");
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
          // Decrease booked_stock in the Product table
          await updateStock({
            id: val.stock_id,
            booked_stock: val.stock.booked_stock - val?.qty,
            t,
          });
          if (val.stock?.stock - val.qty != val.stock?.stock) {
            await addStockHistory({
              stock_before: val.stock?.stock + val?.stock?.booked_stock,
              stock_after:
                val.stock?.stock + val?.stock?.booked_stock - val.qty,
              stock_id: val.stock?.id,
              reference: req.order?.transaction_code,
              t,
            });
          }
        }
        await updateOrder({ t, status: "DELIVERY", id: req.order?.id });
      } else if (req.body?.status == "CANCELED") {
        const orderDetail = await findAllOrderDetail({
          order_id: req.order?.id,
        });
        for (const val of orderDetail) {
          // Decrease booked_stock in the Product table
          const stock = val.stock.stock + val.qty;
          const booked_stock = val.stock.booked_stock - val.qty;
          console.log(stock);
          console.log(booked_stock);
          await db.Stock.update(
            { stock, booked_stock },
            { where: { id: val.stock_id }, transaction: t }
          );
          // await updateStock({
          //   stock,
          //   booked_stock,
          //   id: val.stock_id,
          //   t,
          // });
        }
      } else if (req?.body?.status == "PAYMENT") {
        await updateOrder({
          t,
          last_payment_date: moment(req.order?.last_payment_date).add(1, "day"),
          id: req.order?.id,
        });
        fs.unlinkSync(
          `${__dirname}/../public/shoe/${req.order?.payment_proof}`
        );
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
};
module.exports = orderController;
