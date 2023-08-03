const db = require("../models");
const { nanoid } = require("nanoid");
const { Op, where } = require("sequelize");

const bcrypt = require("bcrypt");
const moment = require("moment");

module.exports = {
  findUser: async (user) => {
    try {
      return await db.User.findOne({
        where: {
          [Op.or]: [
            {
              email: user,
            },
            {
              id: user,
            },
          ],
        },
      });
    } catch (err) {
      return err;
    }
  },
  findToken: async (body) => {
    try {

      const whereClause = {
        expired: {
          [db.Sequelize.Op.gte]: moment().format(),
        },
      };
      if (body.userId) {
        whereClause.userId = body?.userId;
      }
      if (body.token) {
        whereClause.token = body?.token;
      }
      if (body.valid) {
        whereClause.valid = { [Op.like]: `%${body?.valid || 1}%` };
      }
      if (body.status) {
        whereClause.status = { [Op.like]: `%${body?.status || ""}%` };
      }
      return await db.Token.findOne({
        where: whereClause,

      });
    } catch (err) {
      return err;
    }
  },
  createToken: async (id, generateToken, valid, status, t) => {
    try {
      return await db.Token.create(
        {
          expired: moment().add(1, "days").format(),
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
      return await db.Token.update(
        {
          expired: moment()
            .add(10, status == "LOGIN" ? "hours" : "minutes")
            .format(),
          token: generateToken,
          status: status,
          valid: valid,
        },
        {
          where: { userId: { [Op.like]: `%${id || ""}%` } },
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
      body.password = hashPassword;
      return await db.User.update(
        { ...body, status: "verified" },
        {
          where: {
            email: { [Op.like]: `%${body?.email || ""}%` },
            id: { [Op.like]: `%${id || ""}%` },
          },
        },
        { transaction: t }
      );
    } catch (err) {
      return err;
    }
  },
};
