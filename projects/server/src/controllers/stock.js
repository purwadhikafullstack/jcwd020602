const { Op } = require("sequelize");
const db = require("../models");
const { addStockHistory } = require("../service/stockHistory.service");
const { CustomError, ValidationError } = require("../utils/customErrors");
const {
  getAllStock,
  createStock,
  getAllStockFromWarehouse,
  deleteStock,
  updateStock,
  findStockBy,
} = require("../service/stock.service");
const { errorResponse } = require("../utils/function");
const { getWarehouse } = require("../service/warehouse.service");
const stockController = {
  getStock: async (req, res) => {
    try {
      const limit = 8;
      const page = req?.query?.page || 1;
      const offset = (parseInt(page) - 1) * limit;
      let sort = req?.query?.sort || "id";
      const order = req?.query?.order || "ASC";
      const brand_id = req?.query?.brand_id;
      const search = req?.query?.search || "";
      const warehouse = await getWarehouse({
        id: req.query?.warehouse_id || req?.user?.warehouse_id,
      });
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
      const whereClause = {
        [Op.and]: [
          { "$warehouse.id$": warehouse[0]?.dataValues?.id },
          {
            [Op.or]: [
              { "$Sho.name$": { [Op.like]: `%${search}%` } },
              { "$Sho.brand.name$": { [Op.like]: `%${search}%` } },
              { "$shoeSize.size$": { [Op.like]: `%${search}%` } },
            ],
          },
        ],
      };
      if (brand_id) {
        whereClause[Op.and].push({ "$Sho.brand_id$": brand_id });
      }
      const result = await getAllStock({
        whereClause,
        limit,
        offset,
        sort,
        order,
      });
      return res
        .status(200)
        .send({ ...result, totalPages: Math.ceil(result?.count / limit) });
    } catch (err) {
      return errorResponse(res, err, CustomError);
    }
  },
  addStock: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { stock, shoe_id, shoe_size_id, warehouse_id } = req.body;
      const findExisting = await findStockBy({
        shoe_id,
        shoe_size_id,
        warehouse_id,
      });
      let add;
      if (findExisting) {
        add = await updateStock({
          shoe_id,
          shoe_size_id,
          warehouse_id,
          stock: Number(findExisting?.stock) + Number(stock),
          t,
        });
      } else {
        add = await createStock({
          stock,
          shoe_id,
          shoe_size_id,
          warehouse_id,
          t,
        });
      }
      if (stock > 0) {
        const addHistory = await addStockHistory({
          stock_before:
            Number(findExisting?.stock) + Number(findExisting?.booked_stock) ||
            0,
          stock_after: findExisting
            ? Number(findExisting?.stock) +
              Number(findExisting?.booked_stock) +
              Number(stock)
            : stock,
          stock_id: findExisting?.dataValues?.id || add?.dataValues?.id,
          reference: "manual",
          t,
        });
      }
      await t.commit();
      return res.status(200).send({ message: "stock added" });
    } catch (err) {
      await t.rollback();
      await errorResponse(res, err, CustomError);
    }
  },
  editStock: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await updateStock({ id: req?.params?.id, stock: req?.body?.stock, t });
      if (
        req?.body?.stock > 0 &&
        req?.stock?.dataValues?.stock != req?.body?.stock
      ) {
        const addHistory = await addStockHistory({
          stock_before:
            Number(req?.stock?.stock) + Number(req?.stock?.booked_stock),
          stock_after:
            Number(req?.body?.stock) + Number(req?.stock?.booked_stock),
          stock_id: req?.params?.id,
          reference: "manual",
          t,
        });
      }
      await t.commit();
      return res.status(200).send({ message: "Stock updated successfully" });
    } catch (err) {
      await t.rollback();
      await errorResponse(res, err, CustomError);
    }
  },
  deleteStock: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      if (req.stock.booked_stock) {
        throw new ValidationError("There are still pending orders");
      }
      const stock = await deleteStock({ id: req.params.id, t });
      const addHistory = await addStockHistory({
        stock_before:
          Number(req?.stock?.stock) + Number(req?.stock?.booked_stock),
        stock_after: 0,
        stock_id: req?.params?.id,
        reference: "manual",
        t,
      });
      await t.commit();
      return res.status(200).send({
        message: "Stock deleted successfully",
      });
    } catch (err) {
      await t.rollback();
      await errorResponse(res, err, CustomError);
    }
  },
  getStockById: async (req, res, next) => {
    try {
      const stock = await findStockBy({ id: req.params.id });
      if (stock) {
        req.stock = stock;
        next();
      } else {
        return res.status(200).send({ message: "stock not found", stock: {} });
      }
    } catch (err) {
      await errorResponse(res, err, CustomError);
    }
  },
  getStockFromId: async (req, res) => {
    try {
      return res.status(200).send({ message: "stock found", stock: req.stock });
    } catch (err) {
      await errorResponse(res, err, CustomError);
    }
  },
  getStockByWarehouse: async (req, res) => {
    try {
      const stock = await getAllStockFromWarehouse({
        warehouse_id: req.query.warehouse_id,
      });
      return res.status(200).send(stock);
    } catch (err) {
      await errorResponse(res, err, CustomError);
    }
  },
};
module.exports = stockController;
