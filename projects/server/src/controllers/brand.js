const db = require("../models");
const BRAND_URL = process.env.BRAND_URL;

const brandController = {
  addBrand: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name } = req.body;
      const filenames = req.files.map((file) => file.filename);

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
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  deleteBrand: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
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
