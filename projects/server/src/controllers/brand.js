const { Op } = require("sequelize");
const db = require("../models");
const fs = require("fs");
const { errorResponse } = require("../utils/function");
const { CustomError } = require("../utils/customErrors");
const path = require("path");

//-------------------------------------------------- DONE CLEAN CODE! -FAHMI
const brandController = {
  addBrand: async (req, res) => {
    const t = await db.sequelize.transaction();
    const filenames = req?.files.map((file) => file.filename);
    try {
      const { name } = req.body;
      const check = await db.Brand.findOne({ where: { name } });

      if (check) {
        if (filenames) {
          filenames.forEach((filename) => {
            fs.unlinkSync(path.join(__dirname, `../public/brand/${filename}`));
          });
        }
        return res.status(400).send({ message: "name already exists." });
      }

      await db.Brand.create(
        {
          name,
          logo_img: filenames[0] ? "brand/" + filenames[0] : null,
          brand_img: filenames[1] ? "brand/" + filenames[1] : null,
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "success add Brand" });
    } catch (err) {
      if (filenames) {
        filenames.forEach((filename) => {
          fs.unlinkSync(path.join(__dirname, `../public/brand/${filename}`));
        });
      }
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const search = req?.query?.search || "";
      const sort = req?.query?.sort || "name";
      const order = req?.query?.order || "ASC";
      const limit = req?.query?.limit || 8;
      const page = req?.query?.page || 1;
      const offset = (parseInt(page) - 1) * limit;

      const brand = await db.Brand.findAndCountAll({
        include: [db.Shoe],
        where: { name: { [Op.like]: `%${search}%` } },
        distinct: true,
        limit,
        offset,
        order: [[sort, order]],
      });
      return res
        .status(200)
        .send({ ...brand, totalPages: Math.ceil(brand.count / limit) });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
  getAllSelect: async (req, res) => {
    try {
      const brand = await db.Brand.findAll();
      return res.status(200).send(brand);
    } catch (err) {
      errorResponse(res, err, CustomError);
    }
  },
  deleteBrand: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const check = await db.Brand.findOne({ where: { id: req.params.id } });

      if (check) {
        if (check?.dataValues?.logo_img) {
          try {
            fs.unlinkSync(
              path.join(
                __dirname,
                `../public/brand/${check?.dataValues?.logo_img.split("/")[1]}`
              )
            );
          } catch (err) {
            console.log(err);
          }
        }
        if (check?.dataValues?.brand_img) {
          try {
            fs.unlinkSync(
              path.join(
                __dirname,
                `../public/brand/${check?.dataValues?.brand_img.split("/")[1]}`
              )
            );
          } catch (err) {
            console.log(err);
          }
        }
      }

      await db.Brand.destroy({ where: { id: req.params.id }, transaction: t });

      await t.commit();
      return res.status(200).send({ message: "success delete brand" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
};

module.exports = brandController;
