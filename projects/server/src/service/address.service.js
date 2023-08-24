const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  addressChecker: async (user_id) => {
    try {
      return await db.Address.findAll({ where: { user_id }, raw: true });
    } catch (err) {
      return err;
    }
  },
  titleChecker: async (title, user_id, id) => {
    try {
      let address;

      id
        ? (address = await db.Address.findOne({
            where: { title, user_id, id: { [Op.not]: id } },
          }))
        : (address = await db.Address.findOne({
            where: { title, user_id },
          }));
      return address;
    } catch (err) {
      return err;
    }
  },
  nameChecker: async (name, user_id, id) => {
    try {
      let address;
      id
        ? (address = await db.Address.findOne({
            where: { name, user_id, id: { [Op.not]: id } },
          }))
        : (address = await db.Address.findOne({
            where: { name, user_id },
          }));
      return address;
    } catch (err) {
      return err;
    }
  },
  primaryChecker: async (user_id) => {
    try {
      return await db.Address.findOne({
        where: { is_primary: true, user_id },
        raw: true,
      });
    } catch (err) {
      return err;
    }
  },
  updatePrimary: async (t, user_id) => {
    try {
      return await db.Address.update(
        { is_primary: false },
        { where: { is_primary: true, user_id }, transaction: t }
      );
    } catch (err) {
      return err;
    }
  },
  updateEditPrimary: async (t, user_id, id) => {
    try {
      return await db.Address.update(
        { is_primary: false },
        { where: { id, is_primary: true, user_id }, transaction: t }
      );
    } catch (err) {
      return err;
    }
  },
  addAddress: async (t, body, response) => {
    try {
      return await db.Address.create(
        {
          title: body.title,
          name: body.name,
          address: body.address,
          address_details: body.address_details,
          city_id: body.city_id,
          postcode: body.postcode,
          phone: body.phone,
          is_primary: body.is_primary == false ? 0 : 1,
          user_id: body.user_id,
          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
        },
        { transaction: t }
      );
    } catch (err) {
      return err;
    }
  },
  editAddress: async (t, body, response) => {
    try {
      return await db.Address.update(
        {
          title: body.title,
          name: body.name,
          address: body.address,
          address_details: body.address_details,
          city_id: body.city_id,
          postcode: body.postcode,
          phone: body.phone,
          is_primary: body.is_primary == false ? 0 : 1,
          user_id: body.user_id,
          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
        },
        { where: { id: body.id }, transaction: t }
      );
    } catch (err) {
      return err;
    }
  },
  getAllAddress: async ({ search, user_id }) => {
    try {
      const where = {
        [Op.and]: [
          {
            [Op.or]: [
              {
                title: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                address: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                city: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                province: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                recipient: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                phone_number: {
                  [Op.like]: "%" + search + "%",
                },
              },
            ],
          },
          { user_id },
        ],
      };
      return await db.Address.findAll({
        where: where,
        order: [["is_primary", "DESC"]],
      });
    } catch (err) {
      return err;
    }
  },
  getEditAddress: async ({ id, user_id }) => {
    try {
      return await db.Address.findOne({
        where: {
          id,
          user_id,
        },
      });
    } catch (err) {
      return err;
    }
  },
};
