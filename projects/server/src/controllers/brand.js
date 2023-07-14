const db = require("../models");
const BRAND_URL = process.env.BRAND_URL;
const brandController = {
  addBrand: async (req, res) => {
    try {
      const { name } = req.body;
      const filenames = req.files.map((file) => file.filename);

      await db.Brand.create({
        name,
        logo_img: BRAND_URL + filenames[0],
        brand_img: BRAND_URL + filenames[1],
      }).then((result) => res.status(200).send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  getAll: async (req, res) => {
    try {
      await db.Brand.findAll({
        include: [db.Shoe],
      }).then((result) => res.status(200).send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
};

module.exports = brandController;
