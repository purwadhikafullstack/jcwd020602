const db = require("../models");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const moment = require("moment");
const mailer = require("../lib/nodemailer");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const { sequelize } = require("../models");
const AVATAR_URL = process.env.AVATAR_URL;
const userController = {
  register: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { email } = req.body;

      const findEmail = await db.User.findOne({
        where: { email },
      });
      if (findEmail) {
        throw new Error("Email was registered");
      } else {
        const createAccount = await db.users.create({
          email,
          role: "USER",
        });
        const generateToken = nanoid();
        const token = await db.Token.create({
          expired: moment().add(1, "days").format(),
          token: generateToken,
          userId: JSON.stringify({ id: createAccount.dataValues.id }),
          status: "VERIFY",
        });

        const template = await fs.readFile(
          "./src/template/register.html",
          "utf-8"
        );
        let compiledTemplate = handlebars.compile(template);
        let registerTemplate = compiledTemplate({
          registrationLink: `${process.env.URL_REGISTER}/verify/${token.dataValues.token}`,
          email,
        });
        console.log(process.env.URL_REGISTER);
        mailer({
          subject: "email verification link",

          to: email,
          text: registerTemplate,
        });
        t.commit();
        return res.status(201).send({
          message: "register berhasil",
        });
      }
    } catch (err) {
      t.rollback();
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  verify: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { email, password, name } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);

      await db.User.update(
        { password: hashPassword, name, status: "verified" },
        { where: { email } }
      );
      t.commit();
      return res.status(201).send({
        message: "email registered succesfully",
      });
    } catch (err) {
      t.rollback();
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  login: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error("Username or email not found");
      }

      if (!user.dataValues.status) {
        throw new Error("email not verified");
      }

      const match = await bcrypt.compare(password, user.dataValues.password);

      if (!match) {
        throw new Error("Wrong password");
      }
<<<<<<< Updated upstream
=======
      const id = JSON.stringify({ id: user.dataValues.id });
      const generateToken = nanoid();
      let token = await findToken({ userId: id, valid: 1, status: "LOGIN" });
      console.log(token);
      if (!token) {
        await createToken(id, generateToken, true, "LOGIN", t);
      } else {
        await updateToken(id, generateToken, true, "LOGIN", t);
      }
>>>>>>> Stashed changes

      const userId = { id: user.dataValues.id };

      let token = await db.Token.findOne({
        where: {
          userId: JSON.stringify(userId),
          expired: {
            [db.Sequelize.Op.gte]: moment().format(),
          },
          valid: true,
          status: "LOGIN",
        },
      });

      if (!token) {
        token = await db.Token.create({
          expired: moment().add(1, "h").format(),
          token: nanoid(),
          userId: JSON.stringify(userId),
          status: "LOGIN",
        });
      } else {
        token = await db.Token.update(
          {
            expired: moment().add(1, "h").format(),
            token: nanoid(),
          },
          {
            where: { userId: JSON.stringify(userId), status: "LOGIN" },
          }
        );
      }
      t.commit();
      delete user.dataValues.password;
      delete user.dataValues.id;
      return res.status(200).send({
        message: "Success login",
        token: nanoid(),
        data: user.dataValues,
      });
    } catch (err) {
      t.rollback();
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  getByTokenV2: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      let p = await db.Token.findOne({
        where: {
          token,
          expired: {
            [db.Sequelize.Op.gte]: moment().format(),
          },
          valid: true,
        },
      });
      if (!p) {
        throw new Error("token has expired");
      }
      user = await db.User.findOne({
        where: {
          id: JSON.parse(p.dataValues.userId).id,
        },
      });
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
  addAdmin: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name, email, phone, password } = req.body;
      const { filename } = req.file;
      const hashPassword = await bcrypt.hash(password, 10);

      const checkEmail = await db.User.findOne({
        where: {
          email,
        },
      });
      if (checkEmail) {
        throw new ValidationError("Email alredy exists");
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
      return res.send({ message: "success add admin" });
    } catch (err) {
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
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  deleteAdmin: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await db.Admin.destroy(
        { where: { user_id: req.params.id } },
        { transaction: t }
      );

      await db.User.destroy(
        { where: { id: req.params.id } },
        { transaction: t }
      );
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
