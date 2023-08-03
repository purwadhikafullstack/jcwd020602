const db = require("../models");
const { Op } = require("sequelize");
module.exports = {
  addStockHistory: async ({
    stock_before,
    stock_after,
    stock_id,
    reference,
    t,
  }) => {
    try {
      const qty = stock_after - stock_before;
      return await db.StockHistory.create(
        {
          stock_before,
          stock_after,
          qty,
          stock_id,
          status: qty > 0 ? "ADDED" : "DECREASED",
          reference,
        },
        { transaction: t }
      );
    } catch (error) {
      return error;
    }
  },
};
