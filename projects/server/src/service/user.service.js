const db = require("../models");
const { Op } = require("sequelize");
const mailer = require("../lib/nodemailer");
const bcrypt = require("bcrypt");
const moment = require("moment");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

// -------------------------- CLEAR -FAHMI
module.exports = {
  findUser: async (user) => {
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
        { where: { userId: id }, transaction: t }
      );
    } catch (err) {
      return err;
    }
  },
  verifUser: async (body, id, t) => {
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
  addAdmin: async (body, filename, t) => {
    try {
      const hashPassword = await bcrypt.hash(body.password, 10);
      const admin = await db.User.create(
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          password: hashPassword,
          avatar_url: filename ? "avatar/" + filename : null,
          role: "ADMIN",
          status: "verified",
        },
        { transaction: t }
      );
      return admin;
    } catch (err) {
      return err;
    }
  },
  editProfile: async (body, filename, check, t) => {
    try {
      await db.User.update(
        {
          name: body?.name,
          phone: body?.phone,
          avatar_url: filename
            ? "avatar/" + filename
            : check?.dataValues?.avatar_url || null,
        },
        { where: { email: body.email }, transaction: t }
      );
    } catch (err) {
      return err;
    }
  },
  editPassword: async (body, t) => {
    try {
      const { newPassword, email } = body;
      const hashPassword = await bcrypt.hash(newPassword, 10);
      return await db.User.update(
        { password: hashPassword },
        { where: { email }, transaction: t }
      );
    } catch (err) {
      return err;
    }
  },
  mailerEmail: async (data, email, generateToken) => {
    try {
      let template;
      let compiledTemplate;
      let subject;
      let html;
      switch (data) {
        case "register":
          subject = "email verification link";
          template = fs.readFileSync(
            path.join(__dirname, "../template/register.html"),
            "utf-8"
          );
          compiledTemplate = handlebars.compile(template);
          html = compiledTemplate({
            registrationLink: `${process.env.URL}verify/${generateToken}`,
            email,
          });
          break;
        case "forgotPassword":
          subject = "RESET PASSWORD";
          template = fs.readFileSync(
            path.join(__dirname, "../template/forgotPassword.html"),
            "utf-8"
          );
          compiledTemplate = handlebars.compile(template);
          html = compiledTemplate({
            registrationLink: `${process.env.URL}forgot-password/${generateToken}`,
          });
          break;
      }
      mailer({
        subject,
        to: email,
        html,
      });
    } catch (err) {
      return err;
    }
  },
};
