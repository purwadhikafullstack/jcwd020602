const { Op } = require("sequelize");
const db = require("../models");
const { addStockHistory } = require("../service/stockHistory.service");
const {
  CustomError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  BadGatewayError,
  ServiceUnavailableError,
} = require("../utils/customErrors");
const stockController = {
  getStock: async (req, res) => {
    try {
      const limit = 2;
      const page = req?.query?.page || 1;
      const offset = (parseInt(page) - 1) * limit;
      let sort = req?.query?.sort || "id";
      const order = req?.query?.order || "ASC";
      const search = req?.query?.search || "";
      let city_id = req?.query?.city_id || 153;
      const city = await db.User.findOne({
        where: { ...req.user },
        include: [{ model: db.Warehouse, attribute: ["city_id"] }],
      });
      if (city.warehouse_id != null) {
        city_id = city?.dataValues?.warehouse?.city_id;
      }
      switch (sort) {
        case "brand":
          sort = [
            { model: db.Shoe, include: [{ model: db.Brand }] },
            { model: db.Brand },
            "name",
          ];
          break;
        case "name":
          sort = [{ model: db.Shoe }, "name"];
          break;
        case "size":
          sort = [{ model: db.ShoeSize }, "size"];
          break;
        default:
          sort = [sort];
          break;
      }
      db.Stock.findAndCountAll({
        where: {
          [Op.and]: [
            { "$warehouse.city.city_id$": city_id },
            {
              [Op.or]: [
                { "$sho.name$": { [Op.like]: `%${search}%` } },
                { "$sho.brand.name$": { [Op.like]: `%${search}%` } },
              ],
            },
          ],
        },
        include: [
          {
            model: db.Shoe,
            include: [{ model: db.Brand }],
          },
          { model: db.ShoeSize },
          {
            model: db.Warehouse,
            include: [{ model: db.City, attributes: ["city_id", "city_name"] }],
          },
        ],
        limit,
        offset,
        order: [[...sort, order]],
      }).then((result) =>
        res
          .status(200)
          .send({ ...result, totalPages: Math.ceil(result.count / limit) })
      );
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err.message });
    }
  },
  addStock: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { stock, shoe_id, shoe_size_id, warehouse_id } = req.body;
      const add = await db.Stock.create(
        {
          stock,
          shoe_id,
          shoe_size_id,
          warehouse_id,
        },
        {
          transaction: t,
        }
      );
      if (stock > 0) {
        const addHistory = await addStockHistory({
          stock_before: 0,
          stock_after: stock,
          stock_id: add?.dataValues?.id,
          reference: "manual",
          t,
        });
      }
      await t.commit();
      return res.status(200).send({ message: "stock added", add });
    } catch (err) {
      await t.rollback();
      if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ message: err.message });
      } else {
        return res.status(500).send({ message: err.message });
      }
    }
  },
  editStock: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { stock } = req.body;
      await db.Stock.update(
        {
          stock,
        },
        {
          where: {
            id: req?.params?.id,
          },
          transaction: t,
        }
      );
      if (stock > 0) {
        const addHistory = await addStockHistory({
          stock_before: req?.stock?.dataValues?.stock,
          stock_after: stock,
          stock_id: req?.params?.id,
          reference: "manual",
          t,
        });
      }
      await t.commit();
      return res.status(200).send({ message: "Stock updated successfully" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  deleteStock: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const stock = await db.Stock.destroy({
        where: { id: req?.params?.id },
      });
      const addHistory = await addStockHistory({
        stock_before: req?.stock?.dataValues?.stock,
        stock_after: 0,
        stock_id: req?.params?.id,
        reference: "manual",
        t,
      });
      await t.commit();
      console.log(stock);
      return res.status(200).send({
        message: "Stock deleted successfully",
      });
    } catch (err) {
      await t.rollback();
      res.status(500).send({ message: err.message });
    }
  },
  getStockById: async (req, res, next) => {
    try {
      const stock = await db.Stock.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: db.Shoe,
            include: [{ model: db.Brand }],
          },
          { model: db.ShoeSize },
          { model: db.Warehouse },
        ],
      });
      req.stock = stock;
      next();
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
  getStockFromId: async (req, res) => {
    try {
      return res.status(200).send(req.stock);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
  getStockByWarehouse: async (req, res, next) => {
    try {
      const stock = await db.Stock.findAll({
        where: { warehouse_id: req.query.warehouse_id },
        include: [
          {
            model: db.Shoe,
            include: [{ model: db.Brand }],
          },
          { model: db.ShoeSize },
          { model: db.Warehouse },
        ],
      });
      return res.status(200).send(stock);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
};

module.exports = stockController;
