const db = require("../models");
const { nanoid } = require("nanoid");
const { Op } = require("sequelize");

const bcrypt = require("bcrypt");
const moment = require("moment");

module.exports = {
  findUser: async (user) => {
    console.log(user);
    try {
      return await db.User.findOne({
        where: {
          [Op.or]: [{ email: user }, { id: user }],
        },
      });
    } catch (err) {
      return err;
    }
  },
  findToken: async (body) => {
    try {
      const token = body?.token;
      const userId = body?.userId;
      const valid = body?.valid;
      const whereClause = {};

      if (userId) {
        whereClause[Op.and] = [{ userId }];
      } else if (token) {
        whereClause[Op.and] = [
          { token },
          { expired: { [Op.gte]: moment().format() } },
          { valid },
        ];
      }
      return await db.Token.findOne({ where: whereClause });
    } catch (err) {
      return err;
    }
  },
  createToken: async (id, generateToken, valid, status, t) => {
    try {
      let expired;

      if (status === "LOGIN") {
        expired = moment().add(10, "hours").format();
      } else if (status == "VERIFY") {
        expired = moment().add(1, "day").format();
      } else {
        expired = moment().add(10, "minutes").format();
      }
      return await db.Token.create(
        {
          expired: expired,
          token: generateToken,
          userId: id,
          status: status,
          valid: valid,
        },
        { transaction: t }
      );
    } catch (err) {
      return err;
    }
  },
  updateToken: async (id, generateToken, valid, status, t) => {
    try {
      let expired;

      if (status === "LOGIN") {
        expired = moment().add(10, "hours").format();
      } else if (status == "VERIFY") {
        expired = moment().add(1, "day").format();
      } else {
        expired = moment().add(10, "minutes").format();
      }

      return await db.Token.update(
        {
          expired: expired,
          token: generateToken,
          status: status,
          valid: valid,
        },
        {
          where: { userId: id },
        },
        { transaction: t }
      );
    } catch (err) {
      return err;
    }
  },
  updateUser: async (body, id, t) => {
    try {
      const hashPassword = await bcrypt.hash(body.password, 10);
      const whereClause = {};
      if (body.email) {
        whereClause.email = body.email;
      } else if (id) {
        whereClause.id = id;
      }
      return await db.User.update(
        {
          name: body?.name,
          password: hashPassword,
          phone: body?.phone,
          status: "verified",
        },
        {
          where: whereClause,
          transaction: t,
        }
      );
    } catch (err) {
      return err;
    }
  },
};
