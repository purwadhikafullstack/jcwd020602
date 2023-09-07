const db = require("../models");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const fs = require("fs");
const {
  findUser,
  createToken,
  updateToken,
  findToken,
  verifUser,
  addAdmin,
  editProfile,
  editPassword,
  mailerEmail,
} = require("../service/user.service");
const { Op } = require("sequelize");
const path = require("path");

const userController = {
  register: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { email } = req.body;
      const findEmail = await findUser(email);

      if (findEmail) {
        await t.rollback();
        return res.status(400).send({ message: "email was registered" });
      }

      const user = await db.User.create(
        { email, role: "USER" },
        { transaction: t }
      );
      const id = JSON.stringify({ id: user.dataValues.id });
      const generateToken = nanoid();
      await createToken(id, generateToken, 1, "VERIFY", t);
      mailerEmail("register", email, generateToken);
      t.commit();
      return res.status(201).send({
        message: "Check your email for verification",
      });
    } catch (err) {
      t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  verify: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await verifUser(req.body, "", t); //req.body: pass, name, email
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
      return res.status(500).send({ message: err.message });
    }
  },
  login: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      let user = await findUser(req.body?.email);
      if (!user && !req.query?.providerId) {
        await t.rollback();
        return res.status(400).send({ message: "email not found" });
      }
      const salt = req.query?.email
        ? `${req.query?.providerData[0].uid}${req.query?.email}`
        : false;
      if (!user && req.query?.providerId) {
        const hashPassword = await bcrypt.hash(salt, 10);
        user = await db.User.create(
          {
            email: req.query?.email,
            name: req.query?.displayName,
            password: hashPassword,
            phone: req.query?.phoneNumber,
            avatar_url: req.query?.photoURL,
            status: "verified",
            role: "USER",
            providerId: req.query?.providerData[0].providerId,
          },
          { transaction: t }
        );
      }
      const match = await bcrypt.compare(
        salt || req.body?.password,
        user.dataValues.password
      );
      if (!match && req.body?.password == "AB!@12ab") {
        await t.rollback();
        return res.status(400).send({ message: "email already exist" });
      } else if (!match) {
        await t.rollback();
        return res.status(400).send({ message: "wrong password" });
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
      return res.status(500).send({ message: err.message });
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
        mailerEmail("forgotPassword", email, generateToken);
        await t.commit();
        return res.status(200).send({ message: "check your email" });
      } else {
        await t.rollback();
        return res.status(400).send({ message: "Email not found" });
      }
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  forgotPassword: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      let token = req.headers.authorization.split(" ")[1];
      const { email } = req.user;
      await editPassword({ newPassword: req.body.password, email }, t);
      await db.Token.update({ valid: 0 }, { where: { token }, transaction: t });
      await t.commit();
      return res.status(200).send({ message: "success change passowrd" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  editProfile: async (req, res) => {
    const t = await db.sequelize.transaction();
    const filename = req?.file?.filename;
    try {
      const check = await findUser(req.body.email);
      await editProfile(req.body, filename, check, t);

      if (filename) {
        if (check?.dataValues?.avatar_url) {
          try {
            fs.unlinkSync(
              path.join(
                __dirname,
                `../public/avatar/${check.dataValues.avatar_url.split("/")[1]}`
              )
            );
          } catch (err) {
            console.log(err);
          }
        }
      }

      await t.commit();
      return res
        .status(200)
        .send({ message: "Your changes has successfully saved" });
    } catch (err) {
      if (filename) {
        try {
          fs.unlinkSync(path.join(__dirname, `../public/avatar/${filename}`));
        } catch (err) {
          console.log(err);
        }
      }
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  editPassword: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const check = await findUser(req.body.email);
      const match = await bcrypt.compare(
        req.body.oldPassword,
        check.dataValues.password
      );
      if (!match) {
        await t.rollback();
        return res.status(400).send({ message: "Password not match" });
      }
      await editPassword(req.body, t);
      await t.commit();
      return res.status(200).send({ message: "success change password" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  // -------------------------- SUPERADMIN
  addAdmin: async (req, res) => {
    const t = await db.sequelize.transaction();
    const { filename } = req?.file;
    try {
      const check = await findUser(req?.body?.email);

      if (check) {
        if (filename) {
          try {
            fs.unlinkSync(path.join(__dirname, `../public/avatar/${filename}`));
          } catch (err) {
            console.log(err);
          }
        }
        await t.rollback();
        return res.status(400).send({ message: "email already exist" });
      }

      await addAdmin(req.body, filename, t);
      await t.commit();
      return res.status(200).send({ message: "success add admin" });
    } catch (err) {
      if (filename) {
        try {
          fs.unlinkSync(path.join(__dirname, `../public/avatar/${filename}`));
        } catch (err) {
          console.log(err);
        }
      }
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  getAllUser: async (req, res) => {
    try {
      const search = req?.query?.search || "";
      const sort = req?.query?.sort || "name";
      const order = req?.query?.order || "ASC";
      const role = req?.query?.role || "";
      const limit = req?.query?.limit || 8;
      const page = req?.query?.page || 1;
      const offset = (parseInt(page) - 1) * limit;
      const whereClause = { [Op.and]: [] };

      if (role) {
        whereClause[Op.and].push({
          role: { [Op.like]: `${role}%` },
        });
      } else if (search) {
        whereClause[Op.and].push({
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { role: { [Op.like]: `${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
          ],
        });
      }

      const result = await db.User.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        distinct: true,
        order: [[sort, order]],
      });
      return res
        .status(200)
        .send({ ...result, totalPages: Math.ceil(result.count / limit) });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
  getAdminById: async (req, res) => {
    try {
      const user = await db.User.findOne({
        where: { id: req.params.id },
      });
      return res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
  deleteAdmin: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const id = req.params.id;
      const check = await findUser(id);
      await db.Admin.destroy({ where: { user_id: id }, transaction: t });
      await db.User.destroy({ where: { id }, transaction: t });
      if (check?.dataValues?.avatar_url) {
        try {
          fs.unlinkSync(
            path.join(
              __dirname,
              `../public/avatar/${check.dataValues.avatar_url.split("/")[1]}`
            )
          );
        } catch (err) {
          console.log(err);
        }
      }
      await t.commit();
      return res.status(200).send({ message: "success delete admin" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
};
module.exports = userController;
