const db = require("../models");
const dotenv = require("dotenv");
dotenv.config();
const { Op } = require("sequelize");
module.exports = {
  roleChecker: async (id) => {
    try {
      return await db.users.findOne({
        where: { id },
        raw: true,
      });
    } catch (err) {
      return err;
    }
  },
};
