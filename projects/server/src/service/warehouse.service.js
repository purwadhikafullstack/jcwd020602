const db = require("../models");
const { Op } = require("sequelize");
module.exports = {
  addWarehouse: async (t, { name, telephone_number }, response) => {
    try {
      return await db.warehouses.create(
        {
          name,
          address: response.data.results[0].formatted,
          road: response.data.results[0].components.road,
          province:
            response.data.results[0].components.state ||
            response.data.results[0].components.region,
          city:
            response.data.results[0].components.city ||
            response.data.results[0].components.city_district,
          district:
            response.data.results[0].components.district ||
            response.data.results[0].components.suburb ||
            response.data.results[0].components.subdistrict,
          postcode: response.data.results[0].components.postcode,
          telephone_number,
          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
        },
        { transaction: t }
      );
    } catch (err) {
      return err;
    }
  },
  updateWarehouse: async (t, { name, telephone_number }, response) => {
    return await db.warehouses.update(
      {
        name: name ? name : checkWarehouse.name,
        address: response.data.results[0].formatted,
        road: response.data.results[0].components.road,
        province:
          response.data.results[0].components.state ||
          response.data.results[0].components.region,
        city:
          response.data.results[0].components.city_district ||
          response.data.results[0].components.city,
        district:
          response.data.results[0].components.district ||
          response.data.results[0].components.suburb ||
          response.data.results[0].components.subdistrict,
        postcode: response.data.results[0].components.postcode,
        telephone_number: telephone_number
          ? telephone_number
          : checkWarehouse.telephone_number,
        latitude: response.data.results[0].geometry.lat,
        longitude: response.data.results[0].geometry.lng,
      },
      { where: { id: req.params.id }, transaction: t }
    );
  },
  validWarehouse: async (id) => {
    try {
      return await db.warehouses.findOne({
        where: { id },
        raw: true,
      });
    } catch (err) {
      return err;
    }
  },
  getAllWarehouse: async ({ limit, offset, sort, order, keyword }) => {
    try {
      return await db.warehousesfindAndCountAll({
        limit,
        offset,
        order: [[sort, order]],
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: "%" + keyword + "%",
              },
            },
            {
              address: {
                [Op.like]: "%" + keyword + "%",
              },
            },
            {
              city: {
                [Op.like]: "%" + keyword + "%",
              },
            },
            {
              province: {
                [Op.like]: "%" + keyword + "%",
              },
            },
          ],
        },
      });
    } catch (err) {
      return err;
    }
  },
  getWarehouse: async (body) => {
    try {
      const whereClause = {};
      if (body?.id) {
        whereClause.id = body?.id;
      }
      return await db.Warehouse.findAll({
        where: whereClause,
        attribute: ["id"],
        limit: 1,
      });
    } catch (error) {
      return error;
    }
  },
  getWarehouseForSales: async (body) => {
    try {
      return await db.Warehouse.findAll({
        where: { id: body?.id },
        attribute: ["id"],
      });
    } catch (error) {
      return error;
    }
  },
  checkWarehouseSupply: async (body) => {
    try {
      return await db.Warehouse.findAll({
        include: [
          {
            model: db.Stock,
            where: {
              shoe_id: body?.shoe_id,
              shoe_size_id: body?.shoe_size_id,
              stock: {
                [Op.gte]: body?.qty,
              },
            },
          },
        ],
      });
    } catch (error) {
      return error;
    }
  },
};
