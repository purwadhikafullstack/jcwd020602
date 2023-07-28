const db = require("../models");
const { Op } = require("sequelize");
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
      const { from_warehouse_id, to_warehouse_id, qty, stock_id } = req.body;
      const { id } = req.body;
      const mutationChecker = await db.StockMutation.findOne({
        where: {
          from_warehouse_id,
          to_warehouse_id,
          stock_id,
          status: "PENDING",
        },
      });
      if (mutationChecker) {
        throw new ConflictError(
          "there is still mutation pending for this product"
        );
      }
      const add = await db.StockMutation.create(
        {
          req_admin_id: id,
          from_warehouse_id,
          to_warehouse_id,
          qty,
          status: "PENDING",
          stock_id,
        },
        { transaction: t }
      );
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
      console.log("masuk_--__--__--__--__--__--__");
      const { id } = req.params;
      const { status } = req.body;
      const { res_admin_id } = req.body;
      const stockMutation = await db.StockMutation.findOne({
        where: { id },
        include: [{ model: db.Stock }],
      });
      if (!stockMutation) {
        throw new NotFoundError("Mutation not found");
      }
      const add = await db.StockMutation.update(
        {
          status,
          res_admin_id,
        },
        { where: { id }, transaction: t }
      );
      if (status == "APPROVED") {
        const fromStock = await db.Stock.findOne({
          where: {
            warehouse_id: stockMutation.from_warehouse_id,
            shoe_id: stockMutation.stock.shoe_id,
            shoe_size_id: stockMutation.stock.shoe_size_id,
          },
        });
        if (fromStock.stock < stockMutation.qty) {
          throw new ConflictError(
            "Insufficient stock from the from_warehouse."
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
      }
      await t.commit();
      return res.status(200).send({ message: "mutation request made", add });
    } catch (err) {
      await t.rollback();
      if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ message: err.message });
      } else {
        return res.status(500).send({ message: "Internal Server Error" });
      }
    }
  },
};
module.exports = stockMutationController;
