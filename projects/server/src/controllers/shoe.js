const db = require("../models");
SHOE_URL = process.env.SHOE_URL;

const shoeController = {
  addShoe: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const shoe = await db.Shoe.create(
        {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          weight: req.body.weight,
          brand_id: req.body.brand_id,
          category_id: req.body.category_id,
          subcategory_id: req.body.subcategory_id,
        },
        { transaction: t }
      );
      await shoe.save();

      const imageArr = [];
      for (const file of req.files) {
        const { filename } = file;
        const imageUrl = SHOE_URL + filename;
        imageArr.push({ shoe_id: shoe.id, shoe_img: imageUrl });
      }

      await db.ShoeImage.bulkCreate(imageArr, { transaction: t });

      await t.commit();
      return res.status(200).send({ message: "success add shoe" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  getAll: async (req, res) => {
    try {
      const shoes = await db.Shoe.findAll({
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
      });
      return res.status(200).send(shoes);
    } catch (err) {
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
        where: { id },
      });

      if (!shoe) {
        throw new Error("shoe not found");
      }
      return res.status(200).send(shoe);
    } catch (err) {
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
        where: { category_id },
      });

      if (!shoe) {
        throw new Error("shoe not found");
      }
      return res.status(200).send(shoe);
    } catch (err) {
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
        where: { subcategory_id },
      });

      if (!shoe) {
        throw new Error("shoe not found");
      }
      return res.status(200).send(shoe);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  getByBrand: async (req, res) => {
    try {
      const { brand_id } = req.params;
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
        where: { brand_id },
      });

      if (!shoe) {
        throw new Error("shoe not found");
      }
      return res.status(200).send(shoe);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
};

module.exports = shoeController;
