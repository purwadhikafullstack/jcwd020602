const db = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const getStockHistoryDetail = {
  getHistoryDetails: async (req, res) => {
    try {
      const { shoe_id, status, warehouse, month, page, reference } = req.query;
      page = parseInt(page) || 0;
      const limit = 5;
      const offset = limit * page;
      let where = {};
      // Array to store the combined stockIn and stockOut values
      let combinedStock = [];

      if (month) {
        where = {
          status,
          "$stock.shoe_id$": shoe_id,
          "$stock.warehouse.name$": {
            [Op.like]: `%${warehouse}%`,
          },
          createdAt: db.sequelize.where(
            db.sequelize.fn(
              "MONTH",
              db.sequelize.col("stock_histories.createdAt")
            ),
            month
          ),
        };
      } else {
        where = {
          status,
          "$stock.shoe_id$": shoe_id,
          "$stock.warehouse.name$": {
            [Op.like]: `%${warehouse}%`,
          },
        };
      }
      if (reference) {
        where.reference = { [Op.like]: `%${reference}%` };
      } else {
        where.reference = {
          [Op.or]: {
            [Op.like]: "%manual%",
            [Op.like]: "%{tc:%",
          },
        };
      }

      let historyDetails = await db.stockHistories.findAndCountAll({
        include: [
          {
            model: db.stocks,
            as: "stock",
            include: [
              {
                model: db.shoes,
                as: "shoe",
              },
              {
                model: db.warehouses,
                as: "warehouse",
              },
            ],
          },
        ],
        where: where,
        limit,
        offset,
        raw: true,
      });

      historyDetails.rows.forEach((val) => {
        //convert datetime
        val.createdAt = moment(val.createdAt).format("D MMMM YYYY HH.mm");
        // stock in and stock out
        let stock_in = 0;
        let stock_out = 0;
        let difference = val.stock_after - val.stock_before;
        if (difference < 0) {
          stock_out += Math.abs(difference);
        } else {
          stock_in += difference;
        }
        val.stockIn = stock_in;
        val.stockOut = stock_out;

        // Check if shoe with the same name exists in combinedStock array
        const existingShoe = combinedStock.find(
          (item) => item.stock.shoe.name === val.stock.shoe.name
        );

        if (existingShoe) {
          // Update the combined stockIn and stockOut values
          existingShoe.stockIn += stock_in;
          existingShoe.stockOut += stock_out;
        } else {
          // Add a new entry for the shoe with the same name
          combinedStock.push(val);
        }
      });

      let stockInData = combinedStock.filter((val) => {
        val.stockIn > 0;
      });
      let stockOutData = combinedStock.filter((val) => {
        val.stockOut > 0;
      });
      if (status == "ADDED") {
        return res.status(200).send({
          success: true,
          message: "Ok",
          data: stockInData,
        });
      } else if (status == "DECREASED") {
        return res.status(200).send({
          success: true,
          message: "Ok",
          data: stockOutData,
        });
      } else {
        return res.status(200).send({
          success: true,
          message: "Ok",
          data: historyDetails.rows,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.message,
      });
    }
  },
};
module.exports = getStockHistoryDetail;
