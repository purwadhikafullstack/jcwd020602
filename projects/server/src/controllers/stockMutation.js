const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
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
const { addStockHistory } = require("../service/stockHistory.service");
const { errorResponse } = require("../utils/function");
const stockMutationController = {
  addStockMutation: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { to_warehouse_id, qty, stock_id } = req.body;
      const { id } = req.user;
      const stock = await db.Stock.findOne({
        where: { id: stock_id },
      });
      if (!stock || stock.stock < qty) {
        return res
          .status(200)
          .send({ message: "Insufficient stock at the requested warehouse." });
      }
      const create = {
        from_warehouse_id: stock?.dataValues?.warehouse_id,
        to_warehouse_id,
        qty,
        status: "PENDING",
        stock_id: stock?.dataValues?.id,
      };
      if (id) {
        create.req_admin_id = id;
      }
      const add = await db.StockMutation.create(create, { transaction: t });
      await t.commit();
      return res.status(200).send({ message: "mutation request made", add });
    } catch (err) {
      await t.rollback();
      return errorResponse(res, err, CustomError);
    }
  },
  confirmMutation: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { id } = req.params;
      const { status } = req.body;
      const res_admin_id = req?.user?.id;
      const stockMutation = await db.StockMutation.findOne({
        where: { id },
        include: [{ model: db.Stock }],
      });
      if (!stockMutation) {
        throw new NotFoundError("Mutation not found");
      }
      const add = await db.StockMutation.update(
        { res_admin_id, status },
        {
          where: { id },
          transaction: t,
        }
      );
      if (status == "APPROVED") {
        const fromStock = await db.Stock.findOne({
          where: {
            id: stockMutation.stock_id,
          },
        });
        if (fromStock.stock < stockMutation.qty) {
          throw new ConflictError(
            "Insufficient stock at the requested warehouse."
          );
        }
        fromStock.stock -= stockMutation.qty;
        await fromStock.save({ transaction: t });

        const [toStock, created] = await db.Stock.findOrCreate({
          where: {
            warehouse_id: stockMutation.to_warehouse_id,
            shoe_id: stockMutation.stock.shoe_id,
            shoe_size_id: stockMutation.stock.shoe_size_id,
          },
          defaults: { stock: 0 },
        });
        toStock.stock += stockMutation.qty;
        await toStock.save({ transaction: t });

        await addStockHistory({
          stock_before: fromStock.stock + stockMutation.qty,
          stock_after: fromStock.stock,
          stock_id: fromStock.id,
          reference: stockMutation.mutation_code,
          t,
        });
        await addStockHistory({
          stock_before: toStock.stock - stockMutation.qty,
          stock_after: toStock.stock,
          stock_id: toStock.id,
          reference: stockMutation.mutation_code,
          t,
        });
        await t.commit();
        return res.status(200).send({ message: "mutation Approved", add });
      } else if (status == "REJECTED") {
        await t.commit();
        return res.status(200).send({ message: "mutation Rejected" });
      }
    } catch (err) {
      await t.rollback();
      return errorResponse(res, err, CustomError);
    }
  },
  getStockMutation: async (req, res) => {
    try {
      const limit = 2;
      const page = req?.query?.page || 1;
      const offset = (parseInt(page) - 1) * limit;
      let sort = req?.query?.sort || "createdAt";
      const order = req?.query?.order || "DESC";
      const search = req?.query?.search || "";
      let city_id = req?.query?.city_id || 153;
      const time = req.query.time || moment().format();
      const city = await db.User.findOne({
        where: { ...req.user },
        include: [{ model: db.Warehouse, attribute: ["city_id"] }],
      });
      if (city.warehouse_id != null) {
        city_id = city?.dataValues?.warehouse?.city_id;
      }
      const whereClause = {
        [Op.and]: [
          {
            [Op.or]: [
              { "$fromWarehouse.city_id$": city_id },
              { "$toWarehouse.city_id$": city_id },
            ],
          },
          {
            [Op.or]: [
              { "$stock.shoeSizes.size$": { [Op.like]: `%${search}%` } },
              { "$stock.Sho.name$": { [Op.like]: `%${search}%` } },
              { "$stock.Sho.brand.name$": { [Op.like]: `%${search}%` } },
              { mutation_code: { [Op.like]: `%${search}%` } },
            ],
          },
        ],
      };
      if (time) {
        whereClause[Op.and].push(
          {
            createdAt: { [Op.gte]: moment(time).startOf("month").format() },
          },
          {
            createdAt: {
              [Op.lte]: moment(time).endOf("month").format(),
            },
          }
        );
      }
      switch (sort) {
        case "brand":
          sort = [
            {
              model: db.Stock,
              include: [{ model: db.Shoe, include: [{ model: db.Brand }] }],
            },
            { model: db.Shoe, include: [{ model: db.Brand }] },
            { model: db.Brand },
            "name",
          ];
          break;
        case "name":
          sort = [
            { model: db.Stock, include: [{ model: db.Shoe }] },
            { model: db.Shoe },
            "name",
          ];
          break;
        case "size":
          sort = [
            { model: db.Stock, include: [{ model: db.ShoeSize }] },
            { model: db.ShoeSize },
            "size",
          ];
          break;
        default:
          sort = [sort];
          break;
      }
      db.StockMutation.findAndCountAll({
        include: [
          {
            model: db.User,
            required: false,
            as: "requestedBy",
          },
          {
            model: db.Warehouse,
            as: "fromWarehouse",
          },
          {
            model: db.Warehouse,
            as: "toWarehouse",
          },
          {
            model: db.Stock,
            include: [
              { model: db.Shoe, include: [{ model: db.Brand }] },
              { model: db.ShoeSize },
            ],
          },
          {
            model: db.User,
            required: false,
            as: "respondedBy",
          },
        ],
        where: whereClause,
        limit,
        offset,
        order: [[...sort, order]],
      }).then((result) =>
        res
          .status(200)
          .send({ ...result, totalPages: Math.ceil(result.count / limit) })
      );
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getStockMutationById: async (req, res, next) => {
    try {
      const stockMutation = await db.StockMutation.findOne({
        where: { id: req.params.id },
      });
      req.stockMutation = stockMutation;
      next();
    } catch (err) {
      return errorResponse(res, err, CustomError);
    }
  },
  getStockMutationFromId: async (req, res) => {
    try {
      return res.status(200).send(req.stockMutation);
    } catch (err) {
      return errorResponse(res, err, CustomError);
    }
  },
  editStockMutation: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { to_warehouse_id, qty, stock_id } = req.body;
      const { id } = req.user;
      const shoe = await db.Stock.findOne({
        where: { id: stock_id },
      });
      const stock = await db.Stock.findOne({
        where: {
          warehouse_id: shoe?.dataValues?.warehouse_id,
          shoe_id: shoe?.dataValues?.shoe_id,
          shoe_size_id: shoe?.dataValues?.shoe_size_id,
        },
      });
      if (!stock || stock.stock < qty) {
        return res
          .status(200)
          .send({ message: "Insufficient stock at the requested warehouse." });
      }
      const update = {
        from_warehouse_id: stock?.dataValues?.warehouse_id,
        to_warehouse_id,
        qty,
        stock_id: stock?.dataValues?.id,
      };
      if (id) {
        update.req_admin_id = id;
      }
      const add = await db.StockMutation.update(update, {
        where: {
          id: req?.params?.id,
        },
        transaction: t,
      });
      await t.commit();
      return res.status(200).send({ message: "mutation request edited", add });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  deleteStockMutation: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const stockMutation = await db.StockMutation.destroy({
        where: { id: req?.params?.id },
      });
      await t.commit();
      return res.status(200).send({
        message: "Stock Mutation deleted",
      });
    } catch (err) {
      await t.rollback();
      res.status(500).send({ message: err.message });
    }
  },
};
module.exports = stockMutationController;
