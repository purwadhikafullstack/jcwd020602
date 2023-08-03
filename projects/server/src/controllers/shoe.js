const db = require("../models");
SHOE_URL = process.env.SHOE_URL;
const { Op, where } = require("sequelize");
const fs = require("fs");
const includeOptions = [
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
  {
    model: db.Stock,
    attributes: ["stock"],
    include: [db.ShoeSize],
  },
];

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
      if (req.files) {
        for (const file of req.files) {
          const { filename } = file;
          fs.unlinkSync(`${__dirname}/../public/shoe/${filename}`);
        }
      }
      return res.status(500).send(err.message);
    }
  },
  getAllShoe: async (req, res) => {
    try {
      const category = req?.query?.category || "";
      const sub = req?.query?.sub || "";
      const gender = req?.query?.filter?.gender;
      const sort = req?.query?.filter?.sort || "id";
      const order = req?.query?.filter?.order || "ASC";
      const brand = req?.query?.filter?.brand || "";
      const limit = req?.query?.filter?.limit || 4;
      const page = req?.query?.filter?.page || 1;
      const offset = (parseInt(page) - 1) * limit;

      const whereClause = { [Op.and]: [] };
      if (category && sub) {
        whereClause[Op.and].push({
          [Op.and]: [
            { "$Category.name$": { [Op.like]: `${category}%` } },
            { "$subcategory.name$": { [Op.like]: `%${sub}%` } },
          ],
        });
      } else if (category) {
        whereClause[Op.and].push({
          [Op.or]: [
            { "$Category.name$": { [Op.like]: `${category}%` } },
            { "$brand.name$": { [Op.like]: `%${category}%` } },
          ],
        });
      }
      if (brand) {
        whereClause[Op.and].push({
          "$brand.name$": brand,
        });
      }
      if (gender) {
        whereClause[Op.and].push({
          "$Category.name$": gender,
        });
      }
      const shoes = await db.Shoe.findAndCountAll({
        include: includeOptions,
        where: whereClause,
        distinct: true,
        order: [[sort, order]],
      });
      shoes.rows = shoes.rows.slice(offset, page * limit);
      return res
        .status(200)
        .send({ ...shoes, totalPages: Math.ceil(shoes.count / limit) });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  getShoeByName: async (req, res) => {
    try {
      const name = req?.params?.name;
      // const id = req?.params?.id;
      const shoe = await db.Shoe.findOne({
        include: includeOptions,
        where: { [Op.or]: [{ name }, { id: name }] },
      });

      if (!shoe) {
        throw new Error("shoe not found");
      }
      return res.status(200).send(shoe);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  deleteShoe: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const check = await db.ShoeImage.findAll({
        where: { shoe_id: req.params.id },
      });

      await db.Shoe.destroy(
        { where: { id: req.params.id } },
        { transaction: t }
      );

      if (check?.length > 0) {
        const images = check.map((image) => image.shoe_img);
        for (img of images) {
          try {
            fs.unlinkSync(`${__dirname}/../public/shoe/${img.split("/")[5]}`);
            console.log(`berhasil delete sepatu ${img}`);
          } catch (err) {
            console.log(err.message);
          }
        }
      }
      await db.ShoeImage.destroy(
        { where: { shoe_id: req.params.id } },
        { transaction: t }
      );

      await t.commit();
      return res.status(200).send({ message: "success delete product" });
    } catch (err) {
      await t.rollback();
      return res.status(500).dend(err.message);
    }
  },
  editShoe: async (req, res) => {
    const t = await db.sequelize.transaction();
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

      await db.Shoe.update(
        {
          name,
          description,
          price,
          weight,
          brand_id,
          category_id,
          subcategory_id,
        },
        { where: { id: req.params.id } },
        { transaction: t }
      );

      if (req.files && req.files.length > 0) {
        const imageArr = [];
        for (const file of req.files) {
          const filename = file.filename;
          const imageUrl = SHOE_URL + filename;
          imageArr.push({ shoe_id: req.params.id, shoe_img: imageUrl });
        }

        const check = await db.ShoeImage.findAll({
          where: { shoe_id: req.params.id },
        });
        if (check?.length > 0) {
          const images = check.map((image) => image.shoe_img);
          for (img of images) {
            try {
              fs.unlinkSync(`${__dirname}/../public/shoe/${img.split("/")[5]}`);
              console.log(`berhasil delete sepatu ${img}`);
            } catch (err) {
              console.log(err.message);
            }
          }
        }

        await db.ShoeImage.destroy(
          { where: { shoe_id: req.params.id } },
          { transaction: t }
        );
        await db.ShoeImage.bulkCreate(imageArr, { transaction: t });
      }

      await t.commit();
      return res.status(200).send({ message: "success update shoe" });
    } catch (err) {
      await t.rollback();
      if (req.files) {
        for (const file of req.files) {
          const { filename } = file;
          fs.unlinkSync(`${__dirname}/../public/shoe/${filename}`);
        }
      }
      return res.status(500).send(err.message);
    }
  },
};

module.exports = shoeController;
