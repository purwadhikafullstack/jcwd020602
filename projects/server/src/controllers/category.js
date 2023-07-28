const db = require("../models");
const CATEGORY_URL = process.env.CATEGORY_URL;

const categoryController = {
  addCategory: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name } = req.body;
      await db.Category.create(
        { name, category_img: CATEGORY_URL + req?.file?.filename },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "success add Category" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  addSubcategory: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name, category_id } = req.body;
      await db.SubCategory.create({ name, category_id }, { transaction: t });
      await t.commit();
      return res.status(200).send({ message: "success add Subcategory" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  getAllCategory: async (req, res) => {
    try {
      const categories = await db.Category.findAll({
        include: [{ model: db.SubCategory, include: [db.Shoe] }],
      });
      return res.status(200).send(categories);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  getAllSub: async (req, res) => {
    try {
      const subcategories = await db.SubCategory.findAll({
        include: { model: db.Category },
      });
      return res.status(200).send(subcategories);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  getCategoryById: async (req, res) => {
    try {
      const category = await db.Category.findOne({
        where: { id: req.params.id },
      });
      return res.status(200).send(category);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  getSubcategoryById: async (req, res) => {
    try {
      const subcategory = await db.SubCategory.findOne({
        where: { id: req.params.id },
      });
      return res.status(200).send(subcategory);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  editCategory: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name, category } = req.body;
      const filename = req?.file?.filename || category;
      await db.Category.update(
        {
          name,
          category_img: !req?.file?.filename
            ? category
            : CATEGORY_URL + filename,
        },
        { where: { id: req.params.id } },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "success edit category" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  editSubategory: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name } = req.body;
      console.log(req.body);
      await db.SubCategory.update(
        { name },
        { where: { id: req.params.id } },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "success edit subcategory" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  deleteCategory: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await db.SubCategory.destroy(
        {
          where: { category_id: req.params.id },
        },
        { transaction: t }
      );
      await db.Category.destroy(
        { where: { id: req.params.id } },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "success delete category" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  deleteSubcategory: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await db.SubCategory.destroy(
        { where: { id: req.params.id } },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "success delete subcategory" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
};

module.exports = categoryController;
