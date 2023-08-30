const db = require("../models");
const { Op } = require("sequelize");
module.exports = {
  addStockHistory: async (body) => {
    try {
      const { stock_before, stock_after, stock_id, reference, t } = body;
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
  findStockHistory: async (body) => {
    try {
      const { whereClause, limit, offset, sort, order } = body;
      return await db.StockHistory.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: db.Stock,
            paranoid: false,
            include: [
              {
                model: db.Shoe,
                paranoid: false,
                include: [{ model: db.Brand, paranoid: false }],
              },
              { model: db.ShoeSize, paranoid: false },
              {
                model: db.Warehouse,
                paranoid: false,
                include: [
                  {
                    model: db.City,
                    attributes: ["city_id", "city_name", "type"],
                    paranoid: false,
                  },
                ],
              },
            ],
          },
        ],
        distinct: true,
        limit,
        offset,
        order: [[...sort, order]],
      });
    } catch (error) {
      return error;
    }
  },
};
