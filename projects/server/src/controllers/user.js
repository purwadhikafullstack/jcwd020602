const db = require("../models");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const moment = require("moment");
const mailer = require("../lib/nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const {
  findUser,
  createToken,
  updateToken,
  findToken,
  updateUser,
} = require("../service/user.service");
const AVATAR_URL = process.env.AVATAR_URL;

const userController = {
  register: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { email } = req.body;
      const findEmail = await findUser(email);

      if (findEmail) {
        throw new Error("Email was registered");
      } else {
        const user = await db.User.create({ email, role: "USER" });
        const id = JSON.stringify({ id: user.dataValues.id });
        const generateToken = nanoid();
        await createToken(id, generateToken, 1, "VERIFY", t);

        const template = fs.readFileSync(
          "./src/template/register.html",
          "utf-8"
        );
        let compiledTemplate = handlebars.compile(template);
        let registerTemplate = compiledTemplate({
          registrationLink: `${process.env.URL}/verify/${generateToken}`,
          email,
        });
        mailer({
          subject: "email verification link",
          to: email,
          html: registerTemplate,
        });
        t.commit();
        return res.status(201).send({
          message: "Check your email for verification",
        });
      }
    } catch (err) {
      t.rollback();
      return res.status(500).send(err.message);
    }
  },
  verify: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await updateUser(req.body, "", t); //req.body: pass, name, email
      const user = await findUser(req.body.email);
      const id = JSON.stringify({ id: user.dataValues.id });
      await db.Token.update(
        { valid: 0 },
        { where: { userId: id }, transaction: t }
      );
      t.commit();
      return res.status(201).send({ message: "Success create account" });
    } catch (err) {
      t.rollback();
      return res.status(500).send(err.message);
    }
  },
  login: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { email, password } = req.body;
      const user = await findUser(email);
      if (!user) {
        throw new Error("email not found");
      }

      const match = await bcrypt.compare(password, user.dataValues.password);
      if (!match) {
        throw new Error("Wrong password");
      }

      const id = JSON.stringify({ id: user.dataValues.id });
      const generateToken = nanoid();
      let token = await findToken({ userId: id });
      if (!token) {
        await createToken(id, generateToken, 1, "LOGIN", t);
      } else {
        await updateToken(id, generateToken, 1, "LOGIN", t);
      }
      t.commit();
      delete user.dataValues.password;
      delete user.dataValues.id;
      return res.status(200).send({
        message: "Success login",
        token: generateToken,
        data: user.dataValues,
      });
    } catch (err) {
      t.rollback();
      return res.status(500).send(err.message);
    }
  },
  tokenDecoder: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      let p = await findToken({ token: token, valid: 1 });
      if (!p) {
        return res.status(200).send({ message: "token has expired" });
      }

      const id = JSON.parse(p.dataValues.userId).id;
      const user = await findUser(id);
      delete user.dataValues.password;
      req.user = user;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: err.message });
    }
  },
  getUserByToken: async (req, res) => {
    delete req.user.id;
    res.send(req.user);
  },
  generateTokenByEmail: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { email } = req.query;
      const user = await findUser(email);

      if (user) {
        const id = JSON.stringify({ id: user.dataValues.id });
        const check = await findToken({ userId: id });
        const generateToken = nanoid();
        if (check) {
          await updateToken(id, generateToken, 1, "FORGOT-PASSWORD", t);
        } else {
          await createToken(id, generateToken, 1, "FORGOT-PASSWORD", t);
        }

        const template = fs.readFileSync(
          "./src/template/forgotPassword.html",
          "utf-8"
        );
        let compiledTemplate = handlebars.compile(template);
        let resetPasswordTemplate = compiledTemplate({
          registrationLink: `${process.env.URL}/forgot-password/${generateToken}`,
        });
        mailer({
          subject: "RESET PASSWORD",
          to: email,
          html: resetPasswordTemplate,
        });
        await t.commit();
        return res.send({ message: "check your email" });
      } else {
        throw new Error("Email not found");
      }
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  forgotPassword: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      let token = req.headers.authorization.split(" ")[1];
      const { id } = req.user;

      await updateUser(req.body, id, t); //req.body: pass
      await db.Token.update({ valid: 0 }, { where: { token }, transaction: t });
      await t.commit();
      return res.status(200).send({ message: "success change passowrd" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  addAdmin: async (req, res) => {
    const t = await db.sequelize.transaction();
    const { filename } = req?.file;
    try {
      const { name, email, phone, password } = req.body;
      const { filename } = req.file;
      const hashPassword = await bcrypt.hash(password, 10);
      const check = await findUser(email);

      if (check) {
        if (filename) {
          fs.unlinkSync(`${__dirname}/../public/avatar/${filename}`);
        }
        return res.status(400).send({ message: "email alrdy exist" });
      }

      await db.User.create(
        {
          name,
          email,
          phone,
          password: hashPassword,
          avatar_url: AVATAR_URL + filename,
          role: "ADMIN",
          status: "verified",
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "success add admin" });
    } catch (err) {
      if (filename) {
        fs.unlinkSync(`${__dirname}/../public/avatar/${filename}`);
      }
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  getAllUser: async (req, res) => {
    try {
      const result = await db.User.findAll();
      return res.status(200).send(result);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
  getAdminById: async (req, res) => {
    const user = await db.User.findOne({
      where: { id: req.params.id },
    });
    return res.status(200).send(user);
  },
  editAdminById: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name, email, phone, password, avatar } = req.body;
      const filename = req?.file?.filename || avatar;
      const hashPassword = await bcrypt.hash(password, 10);
      const check = findUser(email);

      if (check?.dataValues?.avatar_url) {
        fs.unlinkSync(
          `${__dirname}/../public/avatar/${
            check.dataValues.avatar_url.split("/")[5]
          }`
        );
      }

      await db.User.update(
        {
          name,
          email,
          phone,
          password: hashPassword,
          avatar_url: !req?.file?.filename ? avatar : AVATAR_URL + filename,
        },
        { where: { id: req.params.id } },
        { transaction: t }
      );
      await t.commit();
      return res.send({ message: "success update admin" });
    } catch (err) {
      fs.unlinkSync(req.file.path);
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  deleteAdmin: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const id = req.params.id;
      await db.Admin.destroy({ where: { user_id: id } }, { transaction: t });

      const check = await findUser(id);
      if (check?.dataValues?.avatar_url) {
        fs.unlinkSync(
          `${__dirname}/../public/avatar/${
            check.dataValues.avatar_url.split("/")[5]
          }`
        );
      }

      await db.User.destroy({ where: { id } }, { transaction: t });
      await t.commit();
      return res.status(200).send({ message: "success delete admin" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
};
module.exports = userController;
