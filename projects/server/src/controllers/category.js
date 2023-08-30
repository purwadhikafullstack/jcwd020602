const db = require("../models");
const fs = require("fs");
const { errorResponse } = require("../utils/function");
const { CustomError } = require("../utils/customErrors");
const { Op } = require("sequelize");
const path = require("path");

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
          try {
            fs.unlinkSync(
              path.join(__dirname, `../public/category/${filename}`)
            );
          } catch (err) {
            console.log(err);
          }
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
        try {
          fs.unlinkSync(path.join(__dirname, `../public/category/${filename}`));
        } catch (err) {
          console.log(err);
        }
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
      const search = req?.query?.search || "";
      const sort = req?.query?.sort || "name";
      const order = req?.query?.order || "ASC";
      const limit = req?.query?.limit || 8;
      const page = req?.query?.page || 1;
      const offset = (parseInt(page) - 1) * limit;

      const categories = await db.Category.findAndCountAll({
        include: [{ model: db.SubCategory, include: [db.Shoe] }],
        where: { name: { [Op.like]: `%${search}%` } },
        distinct: true,
        offset,
        limit,
        order: [[sort, order]],
      });
      return res.status(200).send({
        ...categories,
        totalPages: Math.ceil(categories.count / limit),
      });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  getAllSub: async (req, res) => {
    try {
      const search = req?.query?.search || "";
      const sort = req?.query?.sort || "name";
      const order = req?.query?.order || "ASC";
      const category = req?.query?.category || "";
      const limit = req?.query?.limit || 8;
      const page = req?.query?.page || 1;
      const offset = (parseInt(page) - 1) * limit;
      const whereClause = { [Op.and]: [] };

      if (category) {
        whereClause[Op.and].push({
          "$Category.name$": { [Op.like]: `${category}%` },
        });
      } else if (search) {
        whereClause[Op.and].push({
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { "$Category.name$": { [Op.like]: `${search}%` } },
          ],
        });
      }

      const subcategories = await db.SubCategory.findAndCountAll({
        include: { model: db.Category },
        where: whereClause,
        limit,
        distinct: true,
        offset,
        order: [[sort, order]],
      });
      return res.status(200).send({
        ...subcategories,
        totalPages: Math.ceil(subcategories.count / limit),
      });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  getAllCategorySelect: async (req, res) => {
    try {
      const categories = await db.Category.findAll();
      return res.status(200).send(categories);
    } catch (err) {
      errorResponse(res, err, CustomError);
    }
  },
  getAllSubSelect: async (req, res) => {
    try {
      const subcategories = await db.SubCategory.findAll({
        where: { category_id: req.query.category_id },
      });
      return res.status(200).send(subcategories);
    } catch (err) {
      errorResponse(res, err, CustomError);
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
      const checkName = await db.Category.findOne({
        where: { name, id: { [Op.not]: req.params.id } },
      });

      if (checkName) {
        if (filename) {
          try {
            fs.unlinkSync(
              path.join(__dirname, `../public/category/${filename}`)
            );
          } catch (err) {
            console.log(err);
          }
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
          try {
            fs.unlinkSync(
              path.join(
                __dirname,
                `../public/category/${
                  check.dataValues.category_img.split("/")[1]
                }`
              )
            );
          } catch (err) {
            console.log(err);
          }
        }
      }

      await t.commit();
      return res.status(200).send({ message: "success edit category" });
    } catch (err) {
      if (filename) {
        try {
          fs.unlinkSync(path.join(__dirname, `../public/category/${filename}`));
        } catch (err) {
          console.log(err);
        }
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
        try {
          fs.unlinkSync(
            path.join(
              __dirname,
              `../public/category/${
                check.dataValues.category_img.split("/")[1]
              }`
            )
          );
        } catch (err) {
          console.log(err);
        }
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
