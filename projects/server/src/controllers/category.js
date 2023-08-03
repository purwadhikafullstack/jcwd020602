const db = require("../models");
const CATEGORY_URL = process.env.CATEGORY_URL;
const fs = require("fs");

const categoryController = {
  addCategory: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name } = req.body;
      const filename = req?.file?.filename;
      const check = await db.Category.findOne({ where: { name } });

      if (check) {
        fs.unlinkSync(req.file.path);
        return res.status(400).send({ message: "name alrdy exist" });
      }
      await db.Category.create(
        { name, category_img: CATEGORY_URL + filename },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "success add Category" });
    } catch (err) {
      fs.unlinkSync(req.file.path);
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
      const check = await db.Category.findOne({ where: { id: req.params.id } });

      if (check?.dataValues?.category_img) {
        fs.unlinkSync(
          `${__dirname}/../public/category/${
            check.dataValues.category_img.split("/")[5]
          }`
        );
      }

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
      fs.unlinkSync(req.file.path);
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  editSubategory: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name } = req.body;
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
      const check = await db.Category.findOne({ where: { id: req.params.id } });

      await db.SubCategory.destroy(
        { where: { category_id: req.params.id } },
        { transaction: t }
      );

      if (check?.dataValues?.category_img) {
        fs.unlinkSync(
          `${__dirname}/../public/category/${
            check.dataValues.category_img.split("/")[5]
          }`
        );
      }

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
