const db = require("../models");
const { Op } = require("sequelize");

const stockHistoryController = {
  getStockHistory: async (req, res) => {
    try {
      const limit = 2;
      const page = req?.query?.page || 1;
      let offset = (parseInt(page) - 1) * limit;
      let sort = req?.query?.sort || "id";
      const order = req?.query?.order || "ASC";
      const search = req?.query?.search || "";
      const city = req?.query?.city || "";
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
      db.StockHistory.findAndCountAll({
        where: {
          [Op.and]: [
            { "$stock.warehouse.city.city_name$": { [Op.like]: `%${city}%` } },
            {
              [Op.or]: [
                { "$stock.sho.name$": { [Op.like]: `%${search}%` } },
                { "$stock.sho.brand.name$": { [Op.like]: `%${search}%` } },
              ],
            },
          ],
        },
        include: [
          {
            model: db.Stock,
            include: [
              {
                model: db.Shoe,
                include: [{ model: db.Brand }],
              },
              { model: db.ShoeSize },
              {
                model: db.Warehouse,
                include: [
                  { model: db.City, attributes: ["city_id", "city_name"] },
                ],
              },
            ],
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
      res.status(500).send({
        message: err.message,
      });
    }
  },
};
module.exports = stockHistoryController;
