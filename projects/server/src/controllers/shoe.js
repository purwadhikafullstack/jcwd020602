const db = require("../models");

const shoeController = {
  addShoe: async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        weight,
        brand_id,
        category_id,
        subcategory_id,
      } = req.body;

      await db.Shoe.create({
        name,
        description,
        price,
        weight,
        brand_id,
        category_id,
        subcategory_id,
      }).then((result) => res.status(200).send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  getAll: async (req, res) => {
    try {
      await db.Shoe.findAll({
        include: [
          {
            model: db.Brand,
            attributes: ["id", "name", "logo_img", "brand_img"],
          },
          {
            model: db.Category,
            attributes: ["id", "name", "category_img"],
          },
          {
            model: db.SubCategory,
            attributes: ["id", "name"],
          },
          {
            model: db.ShoeImage,
            attributes: ["id", "shoe_img"],
          },
        ],
      }).then((result) => res.status(200).send(result));
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const shoe = await db.Shoe.findOne({
        include: [
          {
            model: db.Brand,
            attributes: ["id", "name", "logo_img", "brand_img"],
          },
          {
            model: db.Category,
            attributes: ["id", "name", "category_img"],
          },
          {
            model: db.SubCategory,
            attributes: ["id", "name"],
          },
          {
            model: db.ShoeImage,
            attributes: ["id", "shoe_img"],
          },
        ],
        where: {
          id,
        },
      });

      if (!shoe) {
        throw new Error("shoe not found");
      }
      return res.status(200).send(shoe);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  getByCategory: async (req, res) => {
    try {
      const { category_id } = req.params;
      const shoe = await db.Shoe.findOne({
        include: [
          {
            model: db.Brand,
            attributes: ["id", "name", "logo_img", "brand_img"],
          },
          {
            model: db.Category,
            attributes: ["id", "name", "category_img"],
          },
          {
            model: db.SubCategory,
            attributes: ["id", "name"],
          },
          {
            model: db.ShoeImage,
            attributes: ["id", "shoe_img"],
          },
        ],
        where: {
          category_id,
        },
      });

      if (!shoe) {
        throw new Error("shoe not found");
      }
      return res.status(200).send(shoe);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
  getBySubcategory: async (req, res) => {
    try {
      const { subcategory_id } = req.params;
      const shoe = await db.Shoe.findOne({
        include: [
          {
            model: db.Brand,
            attributes: ["id", "name", "logo_img", "brand_img"],
          },
          {
            model: db.Category,
            attributes: ["id", "name", "category_img"],
          },
          {
            model: db.SubCategory,
            attributes: ["id", "name"],
          },
          {
            model: db.ShoeImage,
            attributes: ["id", "shoe_img"],
          },
        ],
        where: {
          subcategory_id,
        },
      });

      if (!shoe) {
        throw new Error("shoe not found");
      }
      return res.status(200).send(shoe);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }
  },
};

module.exports = shoeController;
