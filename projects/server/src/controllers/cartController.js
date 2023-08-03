// Import models
const db = require("../models");

// Import Sequelize
const { sequelize } = require("../models");
const { Op } = require("sequelize");

const cartController = {
  getCartData: async (req, res) => {
    try {
      const user_id = req.user.id;
      console.log(`id = ${user_id}`);

      //Get all carts data owned by specific user and merged with products data
      const cartsData = await db.Cart.findAll({
        where: { user_id },
        include: [
          {
            model: db.Shoe,
            as: "Shoes",
          },
        ],
      });

      res.status(200).send({
        message: "Get carts data success",
        data: cartsData,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  },
  addShoe: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { shoe_id, qty, price } = req.body;

      await db.Cart.create({
        shoe_id,
        qty,
        user_id,
        price,
      });
      res.status(200).send({ message: "succes adding shoe to cart" });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },

  // addProduct: async (req, res) => {
  //   try {
  //     const users_id = req.user.id;
  //     const { products_id, quantity } = req.body;

  //     const findProduct = await carts.findOne({
  //       where: { users_id, products_id },
  //     });

  //     const findAvailableStock = await stocks.findOne({
  //       attributes: [
  //         [
  //           sequelize.literal("(SUM(stocks.stock) - product.booked_stock)"),
  //           "availableStock",
  //         ],
  //       ],
  //       include: [
  //         {
  //           model: products,
  //           as: "product",
  //           attributes: [],
  //           where: {
  //             id: products_id,
  //             is_deleted: 0,
  //           },
  //         },
  //       ],
  //     });

  //     if (findProduct) {
  //       if (
  //         findProduct.dataValues.quantity + quantity >
  //         findAvailableStock.dataValues.availableStock
  //       ) {
  //         throw new Error("Product in your cart exceeds available stocks");
  //       } else {
  //         await carts.update(
  //           {
  //             quantity: sequelize.literal(`quantity + ${quantity}`),
  //           },
  //           { where: { id: findProduct.dataValues.id } }
  //         );
  //       }
  //     } else {
  //       await carts.create({ quantity, users_id, products_id });
  //     }

  //     const cartsData = await carts.findAll({
  //       where: { users_id },
  //       include: [
  //         {
  //           model: products,
  //           as: "product",
  //           where: { is_deleted: 0 },
  //           include: [
  //             {
  //               model: stocks,
  //               attributes: [],
  //               required: true,
  //             },
  //           ],
  //           attributes: {
  //             include: [
  //               [
  //                 sequelize.literal(`(
  //                 SELECT SUM(stock)
  //                 FROM stocks
  //                 WHERE
  //                   stocks.products_id = carts.products_id
  //                   AND stocks.is_deleted = 0
  //               ) - product.booked_stock`),
  //                 "availableStock",
  //               ],
  //             ],
  //           },
  //         },
  //       ],
  //     });

  //     res.status(201).send({
  //       isError: false,
  //       message: "Add product success",
  //       data: cartsData,
  //     });
  //   } catch (error) {
  //     res.status(404).send({
  //       isError: true,
  //       message: error.message,
  //       data: null,
  //     });
  //   }
  // },
  // updateCartData: async (req, res) => {
  //   try {
  //     const users_id = req.user.id;
  //     const { id, quantity } = req.body;

  //     //Get cart data
  //     const cartData = await carts.findByPk(id);

  //     //Get available stock for product in cart
  //     const findAvailableStock = await stocks.findOne({
  //       attributes: [
  //         [
  //           sequelize.literal("(SUM(stocks.stock) - product.booked_stock)"),
  //           "availableStock",
  //         ],
  //       ],
  //       include: [
  //         {
  //           model: products,
  //           as: "product",
  //           attributes: [],
  //           where: {
  //             id: cartData.dataValues.products_id,
  //             is_deleted: 0,
  //           },
  //         },
  //       ],
  //     });

  //     if (quantity > findAvailableStock.dataValues.availableStock) {
  //       res.status(404).send({
  //         isError: true,
  //         message: "Product in your cart exceeds available stocks",
  //         data: null,
  //       });
  //     } else {
  //       await carts.update({ quantity }, { where: { users_id, id } });

  //       const cartsData = await carts.findAll({
  //         where: { users_id },
  //         include: [
  //           {
  //             model: products,
  //             as: "product",
  //             where: { is_deleted: 0 },
  //             include: [
  //               {
  //                 model: stocks,
  //                 attributes: [],
  //                 required: true,
  //               },
  //             ],
  //             attributes: {
  //               include: [
  //                 [
  //                   sequelize.literal(`(
  //                   SELECT SUM(stock)
  //                   FROM stocks
  //                   WHERE
  //                     stocks.products_id = carts.products_id
  //                     AND stocks.is_deleted = 0
  //                 ) - product.booked_stock`),
  //                   "availableStock",
  //                 ],
  //               ],
  //             },
  //           },
  //         ],
  //       });

  //       res.status(200).send({
  //         isError: false,
  //         message: "Update cart data success",
  //         data: cartsData,
  //       });
  //     }
  //   } catch (error) {
  //     res.status(404).send({
  //       isError: true,
  //       message: error.message,
  //       data: null,
  //     });
  //   }
  // },
  // deleteCartData: async (req, res) => {
  //   try {
  //     const users_id = req.user.id;
  //     const { id } = req.params;

  //     await carts.destroy({ where: { users_id, id } });

  //     const cartsData = await carts.findAll({
  //       where: { users_id },
  //       include: [
  //         {
  //           model: products,
  //         },
  //       ],
  //     });

  //     res.status(200).send({
  //       isError: false,
  //       message: "Product deleted",
  //       data: cartsData,
  //     });
  //   } catch (error) {
  //     res.status(404).send({
  //       isError: true,
  //       message: error.message,
  //       data: null,
  //     });
  //   }
  // },
  // deliverOrder: async (req, res) => {
  //   const t = await sequelize.transaction();
  //   try {
  //     const { id } = req.params;

  //     //Get order data
  //     const findOrder = await orders.findByPk(id);

  //     await orders.update(
  //       { status: "Shipped" },
  //       { where: { id } },
  //       { transaction: t }
  //     );
  //     t.commit();
  //     res.status(200).send({
  //       isError: false,
  //       message: "Orders has been shipped",
  //       data: findOrder,
  //     });
  //   } catch (error) {
  //     t.rollback();
  //     res.status(404).send({
  //       isError: true,
  //       message: error.message,
  //       data: null,
  //     });
  //   }
  // },
  // getProductQuantityInCart: async (req, res) => {
  //   try {
  //     const users_id = req.user.id;
  //     const { products_id } = req.params;

  //     const productData = await carts.findOne({
  //       where: { users_id, products_id },
  //     });

  //     res.status(200).send({
  //       isError: false,
  //       message: "Get product quantity success",
  //       data: productData?.dataValues?.quantity || 0,
  //     });
  //   } catch (error) {
  //     res.status(404).send({
  //       isError: true,
  //       message: error.message,
  //       data: null,
  //     });
  //   }
  // },
};

module.exports = cartController;
