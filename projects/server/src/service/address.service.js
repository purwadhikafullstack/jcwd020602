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
  addAddress: async (body, user_id, response) => {
    try {
      return await db.addresses.create(
        {
          title: body.title,
          address_details: body.address_details,
          address: body.addAddress,

          city_id: body.city_id,

          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
          recipient: body.recipient,
          phone_number: body.phone_number,
          is_primary: body.is_primary,
          user_id: user_id,
        },
        { transaction: body.t }
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
