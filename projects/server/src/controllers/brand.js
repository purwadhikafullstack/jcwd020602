const db = require("../models");
const BRAND_URL = process.env.BRAND_URL;
const fs = require("fs");
const brandController = {
  addBrand: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name } = req.body;
      const filenames = req.files.map((file) => file.filename);
      const check = await db.Brand.findOne({ where: { name } });

      if (check) {
        filenames.forEach((filename) => {
          fs.unlinkSync(filename);
        });
        return res.status(409).send({ message: "name already exists." });
      }

      await db.Brand.create(
        {
          name,
          logo_img: BRAND_URL + filenames[0],
          brand_img: BRAND_URL + filenames[1],
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "success add Brand" });
    } catch (err) {
      filenames.forEach((filename) => {
        fs.unlinkSync(filename);
      });
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  getAll: async (req, res) => {
    try {
      const brand = await db.Brand.findAll({
        include: [db.Shoe],
      });
      return res.status(200).send(brand);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  deleteBrand: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const check = await db.Brand.findOne({ where: { id: req.params.id } });

      if (check?.dataValues?.logo_img) {
        `${__dirname}/../public/brand/${
          check?.dataValues?.logo_img.split("/")[5]
        }`;
      }
      if (check?.dataValues?.brand_img) {
        `${__dirname}/../public/brand/${
          check?.dataValues?.brand_img.split("/")[5]
        }`;
      }

      await db.Brand.destroy(
        { where: { id: req.params.id } },
        { transaction: t }
      );

      await t.commit();
      return res.status(200).send({ message: "success delete brand" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
};

module.exports = brandController;
