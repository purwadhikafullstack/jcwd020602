const db = require("../models");
const CATEGORY_URL = process.env.CATEGORY_URL;

const categoryController = {
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const { filename } = req.file;

      await db.Category.create({
        name,
        category_img: CATEGORY_URL + filename,
      }).then((result) => res.status(200).send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  addSubcategory: async (req, res) => {
    try {
      const { name } = req.body;
      await db.Subcategory.create({
        name,
      }).then((result) => res.status(200).send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  getAllCategory: async (req, res) => {
    await db.Category.findAll({
      include: [
        {
          model: db.Subcategory,
          include: [db.Shoe],
        },
      ],
    }).then((result) => res.status(200).send(result));
  },
  getAllSubcategory: async (req, res) => {
    await db.Subcategory.findAll({
      include: [db.Shoe],
    }).then((result) => res.status(200).send(result));
  },
};

module.exports = categoryController;
