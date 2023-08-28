const db = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");
module.exports = {
  createMutation: async (body) => {
    try {
      const create = {
        from_warehouse_id: body?.from_warehouse_id,
        to_warehouse_id: body?.to_warehouse_id,
        qty: body?.qty,
        status: body?.status,
        stock_id: body?.stock_id,
      };
      if (body?.req_admin_id) {
        create.req_admin_id = body?.req_admin_id;
      }
      return await db.StockMutation.create(create, {
        transaction: body?.t,
      });
    } catch (error) {
      return error;
    }
  },
  confirmMutation: async (body) => {
    try {
      const update = { status: body?.status };
      if (body?.res_admin_id) {
        update.res_admin_id = body?.res_admin_id;
      }
      return await db.StockMutation.update(update, {
        where: { id: body?.id },
        transaction: body?.t,
      });
    } catch (error) {
      return error;
    }
  },
  findOneMutation: async (body) => {
    try {
      return await db.StockMutation.findOne({
        where: { id: body?.id },
        include: [{ model: db.Stock }],
      });
    } catch (error) {
      return error;
    }
  },
  findAndCountAllMutation: async (body) => {
    try {
      const timeFrom = body?.timeFrom || moment().startOf("M").format();
      const timeTo = body?.timeTo || moment().format();
      const whereClause = {
        [Op.and]: [
          {
            [Op.or]: [
              { "$fromWarehouse.id$": body?.warehouse_id },
              { "$toWarehouse.id$": body?.warehouse_id },
            ],
          },
          {
            [Op.or]: [
              { "$stock.shoeSize.size$": { [Op.like]: `%${body?.search}%` } },
              { "$stock.Sho.name$": { [Op.like]: `%${body?.search}%` } },
              { "$stock.Sho.brand.name$": { [Op.like]: `%${body?.search}%` } },
              { mutation_code: { [Op.like]: `%${body?.search}%` } },
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
      if (body?.brand_id) {
        whereClause[Op.and].push({ "$stock.Sho.brand_id$": body?.brand_id });
      }
      let sort = body?.sort;
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
      return await db.StockMutation.findAndCountAll({
        include: [
          {
            model: db.User,
            required: false,
            as: "requestedBy",
          },
          {
            model: db.Warehouse,
            as: "fromWarehouse",
          },
          {
            model: db.Warehouse,
            as: "toWarehouse",
          },
          {
            model: db.Stock,
            include: [
              { model: db.Shoe, include: [{ model: db.Brand }] },
              { model: db.ShoeSize },
            ],
          },
          {
            model: db.User,
            required: false,
            as: "respondedBy",
          },
        ],
        distinct: true,
        where: whereClause,
        limit: body?.limit,
        offset: (parseInt(body?.page) - 1) * body?.limit,
        order: [[...sort, body?.order]],
      });
    } catch (error) {
      return error;
    }
  },
  updateMutation: async (body) => {
    try {
      const update = {
        from_warehouse_id: body?.from_warehouse_id,
        to_warehouse_id: body?.to_warehouse_id,
        qty: body?.qty,
        stock_id: body?.stock_id,
      };
      if (body?.req_admin_id) {
        update.req_admin_id = body?.req_admin_id;
      }
      return await db.StockMutation.update(update, {
        where: {
          id: body?.id,
        },
        transaction: body?.t,
      });
    } catch (error) {
      return error;
    }
  },
  deleteMutation: async (body) => {
    try {
      return await db.StockMutation.destroy({
        where: { id: body?.id },
        transaction: body?.t,
      });
    } catch (error) {
      return error;
    }
  },
};
