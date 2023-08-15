const db = require("../models");
const moment = require("moment");
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
};
module.exports = orderController;
