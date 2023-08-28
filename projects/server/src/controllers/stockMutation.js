const db = require("../models");
const {
  CustomError,
  ConflictError,
  ValidationError,
} = require("../utils/customErrors");
const { addStockHistory } = require("../service/stockHistory.service");
const { errorResponse } = require("../utils/function");
const { findStockBy, findCreateStock } = require("../service/stock.service");
const {
  createMutation,
  findOneMutation,
  confirmMutation,
  findAndCountAllMutation,
  updateMutation,
  deleteMutation,
} = require("../service/stockMutation.service");
const { getWarehouse } = require("../service/warehouse.service");
const stockMutationController = {
  addStockMutation: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const stock = await findStockBy({ id: req.body?.stock_id });
      if (!stock || stock?.stock < req.body?.qty) {
        throw new ConflictError("Insufficient stock at requested warehouse.");
      } else if (stock?.dataValues?.warehouse_id == req.body?.to_warehouse_id) {
        throw new ValidationError(
          "Cannot perform stock mutation within the same warehouse."
        );
      }
      const add = await createMutation({
        from_warehouse_id: stock?.dataValues?.warehouse_id,
        to_warehouse_id: req.body?.to_warehouse_id,
        qty: req.body?.qty,
        status: "PENDING",
        stock_id: stock?.dataValues?.id,
        req_admin_id: req?.user?.id,
        t,
      });
      await t.commit();
      return res.status(200).send({ message: "mutation request made" });
    } catch (err) {
      await t.rollback();
      return errorResponse(res, err, CustomError);
    }
  },
  confirmMutation: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const res_admin_id = req?.user?.id;
      const stockMutation = await findOneMutation({ id: req.params?.id });
      if (!stockMutation) {
        return res.status(200).send({ message: "Mutation not found" });
      }
      const add = await confirmMutation({
        res_admin_id,
        status: req.body?.status,
        id: req.params?.id,
        t,
      });
      if (req.body?.status == "APPROVED") {
        const fromStock = await findStockBy({ id: stockMutation.stock_id });
        if (fromStock.stock < stockMutation.qty) {
          throw new ConflictError("Insufficient stock at requested warehouse.");
        }
        fromStock.stock -= stockMutation.qty;
        await fromStock.save({ transaction: t });
        const [toStock, created] = await findCreateStock({
          warehouse_id: stockMutation.to_warehouse_id,
          shoe_id: stockMutation.stock.shoe_id,
          shoe_size_id: stockMutation.stock.shoe_size_id,
          t,
        });
        toStock.stock += stockMutation.qty;
        await toStock.save({ transaction: t });
        if (fromStock.stock + stockMutation.qty != fromStock.stock) {
          await addStockHistory({
            stock_before: fromStock.stock + stockMutation.qty,
            stock_after: fromStock.stock,
            stock_id: fromStock.id,
            reference: stockMutation.mutation_code,
            t,
          });
        }
        if (toStock.stock - stockMutation.qty != toStock.stock) {
          await addStockHistory({
            stock_before: toStock.stock - stockMutation.qty,
            stock_after: toStock.stock,
            stock_id: toStock.id,
            reference: stockMutation.mutation_code,
            t,
          });
        }
        await t.commit();
        return res.status(200).send({ message: "mutation Approved" });
      } else if (req.body?.status == "REJECTED") {
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
      const warehouse = await getWarehouse({
        id: req.query?.warehouse_id || req?.user?.warehouse_id,
      });
      const result = await findAndCountAllMutation({
        warehouse_id: warehouse[0]?.dataValues?.id,
        sort: req.query?.sort || "createdAt",
        order: req.query?.order || "DESC",
        search: req.query?.search || "",
        brand_id: req.query?.brand_id,
        page: req.query?.page || 1,
        timeFrom: req.query?.timeFrom,
        timeTo: req.query?.timeTo,
        limit: 8,
      });
      return res
        .status(200)
        .send({ ...result, totalPages: Math.ceil(result?.count / 2) });
    } catch (err) {
      return errorResponse(res, err, CustomError);
    }
  },
  getStockMutationById: async (req, res, next) => {
    try {
      const stockMutation = await findOneMutation({ id: req.params.id });
      if (!stockMutation) {
        return res
          .status(200)
          .send({ message: "Mutation not found", stockMutation: {} });
      }
      req.stockMutation = stockMutation;
      next();
    } catch (err) {
      return errorResponse(res, err, CustomError);
    }
  },
  getStockMutationFromId: async (req, res) => {
    try {
      return res.status(200).send({
        message: "stockMutation not found",
        stockMutation: req?.stockMutation,
      });
    } catch (err) {
      return errorResponse(res, err, CustomError);
    }
  },
  editStockMutation: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const shoe = await findStockBy({ id: req.body?.stock_id });
      const stock = await findStockBy({
        warehouse_id: shoe?.dataValues?.warehouse_id,
        shoe_id: shoe?.dataValues?.shoe_id,
        shoe_size_id: shoe?.dataValues?.shoe_size_id,
      });
      if (!stock || stock.stock < req.body?.qty) {
        throw new ConflictError("Insufficient stock at requested warehouse.");
      } else if (stock?.dataValues?.warehouse_id == req.body?.to_warehouse_id) {
        throw new ValidationError(
          "Cannot perform mutation with the same warehouse."
        );
      }
      const add = await updateMutation({
        from_warehouse_id: stock?.dataValues?.warehouse_id,
        to_warehouse_id: req.body?.to_warehouse_id,
        stock_id: stock?.dataValues?.id,
        req_admin_id: req?.user?.id,
        qty: req.body?.qty,
        id: req.params?.id,
        t,
      });
      await t.commit();
      return res.status(200).send({ message: "mutation request edited" });
    } catch (err) {
      await t.rollback();
      return errorResponse(res, err, CustomError);
    }
  },
  deleteStockMutation: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const stockMutation = await deleteMutation({ id: req.params?.id, t });
      await t.commit();
      return res.status(200).send({ message: "Stock Mutation deleted" });
    } catch (err) {
      await t.rollback();
      return errorResponse(res, err, CustomError);
    }
  },
};
module.exports = stockMutationController;
