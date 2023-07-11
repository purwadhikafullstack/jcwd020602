const db = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const getAllStockHistoryControllers = {
  getAllHistories: async (req, res) => {
    try {
      const { page, warehouse, month, year } = req.query;
      page = parseInt(page) || 0;
      const limit = 5;
      const offset = limit * page;
      let filterStockHistory = {};
      let filterAdditional = {};
      let filterStock = {};
      let response = [];

      if (warehouse) {
        filterStock.warehouse_id = warehouse;
      }

      let startDate = moment(
        month
          ? `${year || moment().year()}-${month}`
          : `${year || moment().year}`
      )
        .startOf(month ? "month" : "year")
        .format("YYYY-MM-DD");
      let endDate = moment(startDate)
        .endOf(month ? "month" : "year")
        .format("YYYY-MM-DD");

      filterStockHistory.updatedAt = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };

      // all warehouse data
      let warehouseData = await db.warehouses.findAll({
        raw: true,
      });

      // all shoes with stock history
      let shoes = await db.shoes.findAndCountAll({
        include: [
          {
            model: db.stocks,
            include: [
              {
                model: db.shoeSizes,
              },
              {
                model: db.stockHistories,
                where: filterStockHistory,
              },
            ],
          },
        ],
        distinct: true,
        col: "id",
        limit,
        offset,
        raw: true,
      });
      console.log({ shoes: shoes });

      let totalPage = Math.ceil(parseInt(shoes.count) / limit);

      // shoe stock looping for certain periods
      shoes.rows.forEach(async (val) => {
        let stockIn = 0;
        let stockOut = 0;
        filterStock.shoe_id = val.id;
        filterAdditional.shoe_id = val.id;
        let name = val.name;
        let stockCount = await db.stockHistories.findAll({
          include: [
            {
              model: db.stocks,
              where: filterStock,
              include: [
                {
                  model: db.shoes,
                },
                {
                  model: db.shoeSizes,
                },
              ],
            },
          ],
          where: filterStockHistory,
          raw: true,
        });
        console.log("stockCount: ", stockCount);

        // stock in & out
        stockCount.forEach((val) => {
          let difference = val.stock_after - val.stock_before;
          if (difference < 0) {
            stockOut += Math.abs(difference);
          } else if (difference > 0) {
            stockIn += difference;
          }
        });

        // latest stock
        let latestStockChecker = await db.stockHistories.findOne({
          include: [
            {
              model: db.stocks,
              where: filterStock,
              include: [
                {
                  model: db.shoes,
                },
              ],
            },
          ],
          where: filterStockHistory,
          raw: true,
          order: [
            ["updatedAt", "desc"],
            ["id", "desc"],
          ],
        });
        console.log({ latestStockChecker: latestStockChecker });

        let latestStock = 0;
        if (warehouse) {
          latestStock = latestStockChecker.stock_after;
        } else {
          let temp = 0;
          warehouseData.forEach(async (val) => {
            filterAdditional.warehouse_id = val.id;
            let stockData = await db.stockHistories.findAll({
              where: filterStockHistory,
              include: [
                {
                  model: db.stocks,
                  where: filterAdditional,
                  include: [
                    {
                      model: db.shoes,
                    },
                  ],
                },
              ],
              raw: true,
              order: [
                ["updatedAt", "desc"],
                ["id", "desc"],
              ],
            });

            if (stockData) {
            }
          });
          latestStock = temp;
        }

        response.push({ name, shoes_id, stockIn, stockOut, latestStock });
      });

      res.status(200).send({
        success: true,
        message: "Ok",
        data: response,
        totalPage,
        warehouse: warehouseData,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  },
};
module.exports = getAllStockHistoryControllers;
