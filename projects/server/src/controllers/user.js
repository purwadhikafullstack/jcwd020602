const db = require("../models");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
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

const userController = {
  register: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { email } = req.body;
      const findEmail = await findUser(email);
      console.log(findEmail);
      if (findEmail) {
        throw new Error("Email was registered");
      } else {
        const user = await db.User.create({
          email,
          role: "USER",
        });
        const id = JSON.stringify({ id: user.dataValues.id });
        const generateToken = nanoid();
        await createToken(id, generateToken, true, "VERIFY", t);

        const template = fs.readFile("./src/template/register.html", "utf-8");
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
      console.log(user);
      if (!user) {
        throw new Error("email not found");
      }

      if (!user.dataValues.status) {
        throw new Error("email not verified");
      }

      const match = await bcrypt.compare(password, user.dataValues.password);

      if (!match) {
        throw new Error("Wrong password");
      }
      const id = JSON.stringify({ id: user.dataValues.id });
      const generateToken = nanoid();
      let token = await findToken({ userId: id, valid: 1, status: "LOGIN" });
      if (!token) {
        await createToken(id, generateToken, true, "LOGIN", t);
      } else {
        await updateToken(id, generateToken, true, "LOGIN", t);
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
      console.log(token);
      let p = await findToken({ token: token, valid: 1 });
      if (!p) {
        throw new Error("token has expired");
      }
      const user = await findUser(JSON.parse(p.dataValues.userId).id);
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
        const check = await findToken({
          userId: id,
          status: "FORGOT-PASSWORD",
        });
        const generateToken = nanoid();
        if (check) {
          await updateToken(id, generateToken, true, "FORGOT-PASSWORD", t);
        } else {
          await createToken(id, generateToken, true, "FORGOT-PASSWORD", t);
        }

        const template = fs.readFile(
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
      console.log(token);
      const { id } = req.user;

      await updateUser(req.body, id, t); //req.body: pass
      await db.Token.update(
        { valid: false },
        { where: { token } },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "success change passowrd" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  addAdmin: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name, email, phone, password } = req.body;
      const { filename } = req?.file;
      const hashPassword = await bcrypt.hash(password, 10);
      const check = await findUser(email);

      if (check) {
        fs.unlinkSync(req?.file?.path);
        return res.status(400).send({ message: "email alrdy exist" });
      }

      await db.User.create(
        {
          name,
          email,
          phone,
          password: hashPassword,
          avatar_url: "avatar/" + filename,
          role: "ADMIN",
          status: "verified",
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "success add admin" });
    } catch (err) {
      // fs.unlinkSync(req?.file?.path);
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
            check.dataValues.avatar_url.split("/")[1]
          }`
        );
      }

      await db.User.update(
        {
          name,
          email,
          phone,
          password: hashPassword,
          avatar_url: !req?.file?.filename ? avatar : "avatar/" + filename,
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
            check.dataValues.avatar_url.split("/")[1]
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
  getWarehouseCity: async (req, res, next) => {
    try {
      let result = await db.Warehouse.findOne({
        where: { id: req.user.warehouse_id },
      });
      return res.status(200).send(result || `153`);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
};
module.exports = userController;
