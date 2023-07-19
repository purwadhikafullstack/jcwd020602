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

      const findEmail = await db.users.findOne({
        where: { email, verified: true },
      });
      if (findEmail) {
        throw new Error("Email was registered");
      } else {
        const createAccount = await db.users.create({
          email,
        });
        const generateToken = nanoid();
        const token = await db.tokens.create({
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
          to: "h72vaquejt@greencafe24.com",
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
      const { email, password, full_name } = req.body;
      const hashPassword = await bcrypt.hash(password, 10);

      await db.users.update(
        { password: hashPassword, full_name, verified: 1 },
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

      const user = await db.users.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error("Username or email not found");
      }

      if (!user.dataValues.verified) {
        throw new Error("email not verified");
      }

      const match = await bcrypt.compare(password, user.dataValues.password);

      if (!match) {
        throw new Error("Wrong password");
      }

      const userId = { id: user.dataValues.id };

      let token = await db.tokens.findOne({
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
        token = await db.tokens.create({
          expired: moment().add(1, "h").format(),
          token: nanoid(),
          userId: JSON.stringify(userId),
          status: "LOGIN",
          // userId: user.dataValues.id,
        });
      }
      t.commit();
      return res.status(200).send({
        message: "Success login",
        token: token.dataValues.token,
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
      // console.log(req.body);
      const token = req.headers.authorization.split(" ")[1];

      console.log(token);
      let p = await db.tokens.findOne({
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
      console.log(p.dataValues);
      user = await db.users.findOne({
        where: {
          id: JSON.parse(p.dataValues.userId).id,
        },
      });
      //id,email,nama,password,dll

      delete user.dataValues.password;
      delete user.dataValues.id;

      req.user = user;

      next();
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: err.message });
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
};
module.exports = userController;
