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
  updateWarehouse: async (
    id,
    t,
    checkWarehouse,
    { name, telephone_number },
    response
  ) => {
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
      { where: { id: id }, transaction: t }
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
  getAllWarehouse: async ({ sort, order, keyword, with_admin }) => {
    try {
      let where = {
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
      };
      if (with_admin == "true" && with_admin != "") {
        where["$users.warehouse_id$"] = {
          [Op.ne]: null,
        };
      } else if (with_admin == "false" && with_admin != "") {
        where["$users.warehouse_id$"] = null;
      }
      const data = await db.warehouses.findAndCountAll({
        include: [
          {
            model: db.users,
            required: false,
          },
        ],
        distinct: true,
        order: [[sort, order]],
        where: { ...where },
      });
      return data;
    } catch (err) {
      return err;
    }
  },
};
