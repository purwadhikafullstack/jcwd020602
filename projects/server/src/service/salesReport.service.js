const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
const include = [
  {
    model: db.Stock,
    paranoid: false,
    attributes: {
      exclude: [
        "payment_proof",
        "status",
        "courier",
        "shipping_cost",
        "total_price",
        "updatedAt",
        "deletedAt",
      ],
    },
    include: [
      {
        model: db.Shoe,
        paranoid: false,
        include: [
          { model: db.Brand, attributes: ["name"], paranoid: false },
          {
            model: db.ShoeImage,
            attributes: ["shoe_img"],
            limit: 1,
            paranoid: false,
          },
        ],
      },
    ],
  },
  {
    model: db.Order,
    paranoid: false,
    include: [{ model: db.User, attributes: ["name"], paranoid: false }],
  },
];
module.exports = {
  countAndSum: async (body) => {
    try {
      const timeFrom = body?.timeFrom || moment().startOf("W").format();
      const timeTo = body?.timeTo || moment().format();
      const whereClause = {
        [Op.and]: [
          {
            [Op.or]: [
              { "$order.user.name$": { [Op.like]: `%${body?.search}%` } },
              {
                "$order.transaction_code$": { [Op.like]: `%${body?.search}%` },
              },
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
          {
            [Op.or]: [
              { "$order.status$": "DELIVERY" },
              { "$order.status$": "DONE" },
            ],
          },
        ],
      };
      if (body?.warehouse_id) {
        whereClause[Op.and].push({
          "$order.warehouse_id$": body?.warehouse_id,
        });
      }
      if (body?.brand_id) {
        whereClause[Op.and].push({
          "$stock.Sho.brand_id$": body?.brand_id,
        });
      }
      if (body?.shoe_id) {
        whereClause[Op.and].push({
          "$stock.shoe_id$": body?.shoe_id,
        });
      }
      if (body?.subcategory_id) {
        whereClause[Op.and].push({
          "$stock.Sho.subcategory_id$": body?.subcategory_id,
        });
      } else if (body?.category_id) {
        whereClause[Op.and].push({
          "$stock.Sho.category_id$": body?.category_id,
        });
      }
      const result = await db.OrderDetail.findAll({
        attributes: { exclude: ["updatedAt", "deletedAt"] },
        include,
        where: whereClause,
        order: [["createdAt", "ASC"]],
        distinct: true,
      });
      return result;
    } catch (error) {
      return error;
    }
  },
};
