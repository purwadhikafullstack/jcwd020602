const db = require("../models");
const { Op } = require("sequelize");
module.exports = {
  getAllStock: async (body) => {
    try {
      const { whereClause, limit, offset, sort, order } = body;
      return await db.Stock.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: db.Shoe,
            include: [{ model: db.Brand }],
          },
          { model: db.ShoeSize },
          {
            model: db.Warehouse,
            include: [{ model: db.City, attributes: ["city_id", "city_name"] }],
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
  findStockBy: async (body) => {
    try {
      const whereClause = {};
      if (body?.id) {
        whereClause.id = body?.id;
      }
      if (body?.shoe_id && body?.shoe_size_id && body?.warehouse_id) {
        whereClause.shoe_id = body?.shoe_id;
        whereClause.shoe_size_id = body?.shoe_size_id;
        whereClause.warehouse_id = body?.warehouse_id;
      }
      return await db.Stock.findOne({
        where: whereClause,
        include: [
          {
            model: db.Shoe,
            include: [{ model: db.Brand }],
          },
          { model: db.ShoeSize },
          { model: db.Warehouse },
        ],
      });
    } catch (error) {
      return error;
    }
  },
  getAllStockFromWarehouse: async (body) => {
    try {
      return await db.Stock.findAll({
        where: { warehouse_id: body?.warehouse_id },
        include: [
          {
            model: db.Shoe,
            include: [{ model: db.Brand }],
          },
          { model: db.ShoeSize },
          { model: db.Warehouse },
        ],
      });
    } catch (error) {
      return error;
    }
  },
  createStock: async (body) => {
    try {
      const { stock, shoe_id, shoe_size_id, warehouse_id, t } = body;
      return await db.Stock.create(
        {
          stock,
          shoe_id,
          shoe_size_id,
          warehouse_id,
        },
        {
          transaction: t,
        }
      );
    } catch (error) {
      return error;
    }
  },
  deleteStock: async (body) => {
    try {
      return await db.Stock.destroy({
        where: { id: body?.id },
        transaction: body?.t,
      });
    } catch (error) {
      return error;
    }
  },
  updateStock: async (body) => {
    try {
      const whereClause = {};
      const update = {};
      if (body?.id) whereClause.id = body?.id;
      if (body?.warehouse_id && body?.shoe_id && body?.shoe_size_id) {
        whereClause.shoe_id = body?.shoe_id;
        whereClause.shoe_size_id = body?.shoe_size_id;
        whereClause.warehouse_id = body?.warehouse_id;
      }
      if (body?.stock >= 0) update.stock = body?.stock;
      if (body?.booked_stock >= 0) update.booked_stock = body?.booked_stock;
      return await db.Stock.update(update, {
        where: whereClause,
        transaction: body?.t,
      });
    } catch (error) {
      return error;
    }
  },
  findCreateStock: async (body) => {
    try {
      return await db.Stock.findOrCreate({
        where: {
          warehouse_id: body?.warehouse_id,
          shoe_id: body?.shoe_id,
          shoe_size_id: body?.shoe_size_id,
        },
        defaults: { stock: 0, booked_stock: 0 },
        transaction: body?.t,
      });
    } catch (error) {
      return error;
    }
  },
};
