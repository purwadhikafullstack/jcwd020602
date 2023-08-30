const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const { findStockHistory } = require("../service/stockHistory.service");
const { getWarehouse } = require("../service/warehouse.service");
const stockHistoryController = {
  getStockHistory: async (req, res) => {
    try {
      const limit = 8;
      const page = req?.query?.page || 1;
      const offset = (parseInt(page) - 1) * limit;
      let sort = req?.query?.sort || "createdAt";
      const order = req?.query?.order || "DESC";
      const search = req?.query?.search || "";
      const brand_id = req?.query?.brand_id;
      const timeFrom = req?.query?.timeFrom || moment().startOf("M").format();
      const timeTo = req?.query?.timeTo || moment().format();
      const warehouse = await getWarehouse({
        id: req.query?.warehouse_id || req?.user?.warehouse_id,
      });
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
      const whereClause = {
        [Op.and]: [
          { "$stock.warehouse_id$": warehouse[0]?.dataValues?.id },
          {
            [Op.or]: [
              { reference: { [Op.like]: `%${search}%` } },
              { "$stock.Sho.name$": { [Op.like]: `%${search}%` } },
              { "$stock.Sho.brand.name$": { [Op.like]: `%${search}%` } },
              { "$stock.shoeSize.size$": { [Op.like]: `%${search}%` } },
            ],
          },
          {
            createdAt: {
              [Op.gte]: moment(timeFrom).startOf("date").format(),
            },
          },
          {
            createdAt: {
              [Op.lte]: moment(timeTo).endOf("date").format(),
            },
          },
        ],
      };
      if (brand_id) {
        whereClause[Op.and].push({ "$stock.Sho.brand_id$": brand_id });
      }
      const result = await findStockHistory({
        whereClause,
        limit,
        offset,
        sort,
        order,
      });
      return res
        .status(200)
        .send({ ...result, totalPages: Math.ceil(result.count / limit) });
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
};
module.exports = stockHistoryController;
