const db = require("../models");
const { Op } = require("sequelize");
module.exports = {
  addressChecker: async (user_id) => {
    try {
      return await db.addresses.findAll({
        where: {
          user_id,
        },
        raw: true,
      });
    } catch (err) {
      return err;
    }
  },
  titleChecker: async (title, user_id) => {
    try {
      return await db.addresses.findOne({
        where: {
          title,
          user_id,
        },
      });
    } catch (err) {
      return err;
    }
  },
  primaryChecker: async (user_id) => {
    try {
      return await db.addresses.findOne({
        where: {
          is_primary: true,
          user_id,
        },
        raw: true,
      });
    } catch (err) {
      return err;
    }
  },
  updatePrimary: async (t, user_id) => {
    try {
      return await db.addresses.update(
        {
          is_primary: false,
        },
        {
          where: {
            is_primary: true,
            user_id,
          },
          transaction: t,
        }
      );
    } catch (err) {
      return err;
    }
  },
  updateEditPrimary: async (t, user_id, id) => {
    try {
      return await db.addresses.update(
        {
          is_primary: false,
        },
        {
          where: {
            id,
            is_primary: true,
            user_id,
          },
          transaction: t,
        }
      );
    } catch (err) {
      return err;
    }
  },
  addAddress: async (
    t,
    { title, address_details, recipient, phone_number, is_primary, user_id },
    response
  ) => {
    try {
      return await db.addresses.create(
        {
          title,
          address_details,
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
          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
          recipient,
          phone_number,
          is_primary,
          user_id,
        },
        { transaction: t }
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
      return await db.addresses.findAll({
        where: where,
        order: [["is_primary", "DESC"]],
      });
    } catch (err) {
      return err;
    }
  },
  getEditAddress: async ({ id, user_id }) => {
    try {
      return await db.addresses.findOne({
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
