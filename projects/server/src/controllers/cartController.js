// Import models
const db = require("../models");

// Import Sequelize
const { sequelize } = require("../models");
const { Op } = require("sequelize");

const cartController = {
  getCartData: async (req, res) => {
    try {
      const user_id = req.user.id;
      const page = req.query.page || 1;
      const pageSize = req.query.pageSize || 10;
      const cartsData = await db.Cart.findAndCountAll({
        where: { user_id },
        include: [
          {
            model: db.Shoe,
            as: "Shoes",
            include: [
              {
                model: db.Category,
              },
              {
                model: db.ShoeImage,
              },
            ],
          },
          {
            model: db.ShoeSize,
            as: "ShoeSize",
          },
        ],
        offset: (page - 1) * pageSize,
        limit: pageSize,
      });

      const cartRows = cartsData.rows;
      for (const cartRow of cartRows) {
        const stockSum = await db.Stock.sum("stock", {
          where: {
            shoe_size_id: cartRow.ShoeSize.id,
            shoe_id: cartRow.Shoes.id,
          },
        });
        cartRow.Shoes.dataValues.availableStock = stockSum || 0;
      }
      const totalPages = Math.ceil(cartsData.count / pageSize);

      return res.status(200).send({
        message: "Get carts data success",
        data: cartRows,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          pageSize: pageSize,
          totalItems: cartsData.count,
        },
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  },

  addShoe: async (req, res) => {
    try {
      const user_id = req?.user?.id;
      const { size, name } = req.body;

      const shoe = await db.Shoe.findOne({
        where: { name },
      });
      if (!shoe) {
        throw new Error("Shoe not found");
      }
      const shoeSize = await db.ShoeSize.findOne({
        where: { size },
      });

      const cartItem = await db.Cart.findOne({
        where: { shoe_id: shoe.id, shoe_size_id: shoeSize.id },
      });
      if (cartItem) {
        throw new Error(
          "Shoe was already in Cart, go to cart to change your shoe"
        );
      } else {
        await db.Cart.create({
          qty: 1,
          shoe_id: shoe.id,
          user_id,
          shoe_size_id: shoeSize.id,
        });
      }

      return res
        .status(200)
        .send({ message: "Product added to cart successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: err.message });
    }
  },
  updateCart: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const user_id = req.user.id;
      const { id, qty } = req.body;

      const cartData = await db.Cart.findOne({ where: { id } });

      const availableStock = await db.Stock.findOne({
        where: {
          shoe_size_id: cartData.dataValues.shoe_size_id,
        },
      });

      if (qty > availableStock.dataValues.stock) {
        return res.status(500).send({
          message: "Product in your cart exceeds available stocks",
          data: null,
        });
      } else {
        await db.Cart.update({ qty }, { where: { user_id, id } });
      }
      const cartsData = await db.Cart.findAndCountAll({
        where: { user_id },
        include: [
          {
            model: db.Shoe,
            as: "Shoes",
            include: [
              {
                model: db.Category,
              },
              {
                model: db.ShoeImage,
              },
            ],
          },
          {
            model: db.ShoeSize,
            as: "ShoeSize",
          },
        ],
      });

      const cartRows = cartsData.rows;
      for (const cartRow of cartRows) {
        const stockSum = await db.Stock.sum("stock", {
          where: {
            shoe_size_id: cartRow.ShoeSize.id,
            shoe_id: cartRow.Shoes.id,
          },
        });
        cartRow.Shoes.dataValues.availableStock = stockSum || 0;
      }

      // const updatedCartData = await cartController.getCartData(req, res);
      t.commit();
      return res
        .status(200)
        .send({ message: "Updating quantity success", data: cartRows });
    } catch (err) {
      t.rollback();
      console.error("Error updating cart item quantity:", err);
      return res.status(500).send({ message: err.message });
    }
  },

  deleteCartData: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { id } = req.params;

      await db.Cart.destroy({ where: { user_id, id } });

      const cartsData = await db.Cart.findAndCountAll({
        where: { user_id },
        include: [
          {
            model: db.Shoe,
            as: "Shoes",
            include: [
              {
                model: db.Category,
              },
              {
                model: db.ShoeImage,
              },
            ],
          },
          {
            model: db.ShoeSize,
            as: "ShoeSize",
          },
        ],
      });

      const cartRows = cartsData.rows;
      for (const cartRow of cartRows) {
        const stockSum = await db.Stock.sum("stock", {
          where: {
            shoe_size_id: cartRow.ShoeSize.id,
            shoe_id: cartRow.Shoes.id,
          },
        });
        cartRow.Shoes.dataValues.availableStock = stockSum || 0;
      }

      return res.status(200).send({
        isError: false,
        message: "Product deleted",
        data: cartRows,
      });
    } catch (error) {
      return res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};

module.exports = cartController;
