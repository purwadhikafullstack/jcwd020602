const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
module.exports = {
  findAndCountAllOrder: async (body) => {
    try {
      const timeFrom = body?.timeFrom || moment().startOf("week").format();
      const timeTo = body?.timeTo || moment().format();
      const whereClause = {
        [Op.and]: [
          {
            warehouse_id: body?.warehouse_id,
          },
          {
            [Op.or]: [
              { "$user.name$": { [Op.like]: `%${body?.search}%` } },
              { transaction_code: { [Op.like]: `%${body?.search}%` } },
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
      if (body?.status) {
        whereClause[Op.and].push({ status: body?.status });
      }
      let sort = body?.sort;
      switch (sort) {
        case "name":
          sort = [{ model: db.User }, "name"];
          break;
        default:
          sort = [sort];
          break;
      }
      const result = await db.Order.findAndCountAll({
        attributes: { exclude: ["updatedAt", "deletedAt"] },
        include: [
          {
            model: db.OrderDetail,
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            include: [
              {
                model: db.Stock,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
                include: [
                  {
                    model: db.Shoe,
                    attributes: ["id", "name", "price"],
                    include: {
                      model: db.ShoeImage,
                      attributes: ["shoe_img"],
                      limit: 1,
                    },
                  },
                  {
                    model: db.ShoeSize,
                    attributes: ["size"],
                  },
                ],
              },
            ],
          },
          { model: db.User, attributes: ["name"] },
          {
            model: db.Address,
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            include: [
              {
                model: db.City,
                attributes: ["type", "city_name", "province", "postal_code"],
              },
            ],
          },
        ],
        where: whereClause,
        order: [[...sort, body?.order]],
        distinct: true,
      });
      return {
        count: result.count,
        rows: result.rows.slice(
          (parseInt(body?.page) - 1) * body?.limit,
          body?.limit * body?.page
        ),
      };
    } catch (error) {
      return error;
    }
  },
  updateOrder: async (body) => {
    try {
      const update = {};
      if (body?.status) {
        update.status = body?.status;
      }
      if (body?.last_payment_date) {
        update.last_payment_date = body?.last_payment_date;
      }
      return await db.Order.update(update, {
        where: { id: body?.id },
        transaction: body?.t,
      });
    } catch (error) {
      return error;
    }
  },
  findOneOrder: async (body) => {
    try {
      return await db.Order.findOne({
        where: { id: body?.id },
        include: [
          {
            model: db.OrderDetail,
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            include: [
              {
                model: db.Stock,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
                include: [
                  {
                    model: db.Shoe,
                    attributes: ["id", "name", "price", "weight"],
                    include: {
                      model: db.ShoeImage,
                      attributes: ["shoe_img"],
                      limit: 1,
                    },
                  },
                  {
                    model: db.ShoeSize,
                    attributes: ["size"],
                  },
                ],
              },
            ],
          },
          { model: db.User, attributes: ["name"] },
          {
            model: db.Address,
            attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
            include: [
              {
                model: db.City,
                attributes: ["type", "city_name", "province", "postal_code"],
              },
            ],
          },
        ],
      });
    } catch (error) {
      return error;
    }
  },
};
