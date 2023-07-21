const db = require("../models");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const moment = require("moment");
const mailer = require("../lib/nodemailer");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const { sequelize } = require("../models");

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

  getUserByToken: async (req, res) => {
    // delete user.dataValues.password;
    res.send(req.user);
  },
  addAdmin: async (req, res) => {
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
        throw new Error("Email alredy exists");
      }

      await db.User.create({
        name,
        email,
        phone,
        password: hashPassword,
        avatar_url: AVATAR_URL + filename,
        role: "ADMIN",
        status: "verified",
      });
      return res.send({ message: "success add admin" });
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  getAllUser: async (req, res) => {
    try {
      const result = await db.User.findAll();
      return res.status(200).send(result.dataValues);
    } catch (err) {
      res.status(500).send({
        message: err.message,
      });
    }
  },
};
module.exports = userController;
