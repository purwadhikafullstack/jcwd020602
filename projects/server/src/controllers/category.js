const db = require("../models");
const fs = require("fs");

//-------------------------------------------------- DONE CLEAN CODE! -FAHMI
const categoryController = {
  addCategory: async (req, res) => {
    const t = await db.sequelize.transaction();
    const filename = req?.file?.filename;
    try {
      const { name } = req.body;
      const check = await db.Category.findOne({ where: { name } });

      if (check) {
        if (filename) {
          fs.unlinkSync(`${__dirname}/../public/category/${filename}`);
        }
        return res.status(400).send({ message: "name alrdy exist" });
      }

      await db.Category.create(
        { name, category_img: filename ? "category/" + filename : null },
        { transaction: t }
      );

      await t.commit();
      return res.status(200).send({ message: "success add Category" });
    } catch (err) {
      if (filename) {
        fs.unlinkSync(`${__dirname}/../public/category/${filename}`);
      }
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
    const filename = req?.file?.filename;
    try {
      const { name } = req.body;
      const check = await db.Category.findOne({ where: { id: req.params.id } });

      if (check) {
        if (filename) {
          fs.unlinkSync(`${__dirname}/../public/category/${filename}`);
        }
        return res.status(400).send({ message: "name alrdy exist" });
      }

      await db.Category.update(
        {
          name,
          category_img: filename
            ? "category/" + filename
            : check?.dataValues?.category_img || null,
        },
        { where: { id: req.params.id }, transaction: t }
      );

      if (check?.dataValues?.category_img) {
        if (filename) {
          fs.unlinkSync(
            `${__dirname}/../public/category/${
              check.dataValues.category_img.split("/")[1]
            }`
          );
        }
      }

      await t.commit();
      return res.status(200).send({ message: "success edit category" });
    } catch (err) {
      if (filename) {
        fs.unlinkSync(`${__dirname}/../public/category/${filename}`);
      }
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
        { where: { id: req.params.id }, transaction: t }
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

      await db.SubCategory.destroy({
        where: { category_id: req.params.id },
        transaction: t,
      });

      await db.Category.destroy({
        where: { id: req.params.id },
        transaction: t,
      });

      if (check?.dataValues?.category_img) {
        fs.unlinkSync(
          `${__dirname}/../public/category/${
            check.dataValues.category_img.split("/")[1]
          }`
        );
      }

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
      await db.SubCategory.destroy({
        where: { id: req.params.id },
        transaction: t,
      });
      await t.commit();
      return res.status(200).send({ message: "success delete subcategory" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
};

module.exports = categoryController;
