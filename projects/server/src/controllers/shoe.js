const db = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const { errorResponse } = require("../utils/function");
const { CustomError } = require("../utils/customErrors");
const path = require("path");
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

//-------------------------------------------------- DONE CLEAN CODE! -FAHMI
const shoeController = {
  addShoe: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const check = await db.Shoe.findOne({ where: { name: req?.body?.name } });

      if (check) {
        if (req?.files) {
          for (const file of req.files) {
            try {
              const { filename } = file;
              fs.unlinkSync(path.join(__dirname, `../public/shoe/${filename}`));
            } catch (err) {
              console.log(err);
            }
          }
        }
        return res.status(400).send({ message: "name alrdy exist" });
      }

      const shoe = await db.Shoe.create(
        {
          name: req?.body?.name,
          description: req?.body?.description,
          price: req?.body?.price,
          weight: req?.body?.weight,
          brand_id: req?.body?.brand_id,
          category_id: req?.body?.category_id,
          subcategory_id: req?.body?.subcategory_id,
          status: req?.body?.status,
        },
        { transaction: t }
      );
      await shoe.save();

      const imageArr = [];
      for (const file of req.files) {
        const { filename } = file;
        const imageUrl = "shoe/" + filename;
        imageArr.push({ shoe_id: shoe.id, shoe_img: imageUrl });
      }

      await db.ShoeImage.bulkCreate(imageArr, { transaction: t });

      await t.commit();
      return res.status(200).send({ message: "success add shoe" });
    } catch (err) {
      if (req.files) {
        for (const file of req.files) {
          try {
            const { filename } = file;
            fs.unlinkSync(path.join(__dirname, `../public/shoe/${filename}`));
          } catch (err) {
            console.log(err);
          }
        }
      }
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  getAllShoe: async (req, res) => {
    try {
      const sub = req?.query?.sub || "";
      const category = req?.query?.category || "";
      const gender = req?.query?.filter?.gender || "";
      const size = req?.query?.filter?.size || "";
      const brand = req?.query?.filter?.brand || "";
      const search = req?.query?.filter?.search || "";
      const sort = req?.query?.filter?.sort || "id";
      const order = req?.query?.filter?.order || "ASC";
      const limit = req?.query?.filter?.limit || 8;
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
      } else if (search) {
        whereClause[Op.and].push({
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { "$Category.name$": { [Op.like]: `${search}%` } },
            { "$brand.name$": { [Op.like]: `%${search}%` } },
            { "$subcategory.name$": { [Op.like]: `%${search}%` } },
          ],
        });
      }

      if (brand && size) {
        whereClause[Op.and].push({
          [Op.and]: [
            { "$brand.name$": brand },
            { "$stocks.shoeSize.size$": size },
          ],
        });
      } else if (gender && size) {
        whereClause[Op.and].push({
          [Op.and]: [
            { "$Category.name$": gender },
            { "$stocks.shoeSize.size$": size },
          ],
        });
      } else if (brand) {
        whereClause[Op.and].push({
          "$brand.name$": brand,
        });
      } else if (gender) {
        whereClause[Op.and].push({
          "$Category.name$": gender,
        });
      } else if (size) {
        whereClause[Op.and].push({
          "$stocks.shoeSize.size$": size,
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
  getAllShoeSelect: async (req, res) => {
    try {
      const whereClause = {};
      if (req.query.subcategory_id) {
        whereClause.subcategory_id = req.query.subcategory_id;
      } else if (req.query.category_id) {
        whereClause.category_id = req.query.category_id;
      }
      if (req.query.brand_id) {
        whereClause.brand_id = req.query.brand_id;
      }
      let shoes = await db.Shoe.findAll({
        where: whereClause,
      });
      if (
        !req.query.brand_id &&
        !req.query.subcategory_id &&
        !req.query.category_id
      ) {
        shoes = [];
      }

      return res.status(200).send(shoes);
    } catch (err) {
      errorResponse(res, err, CustomError);
    }
  },
  getShoeByName: async (req, res) => {
    try {
      const name = req?.params?.name;
      const shoe = await db.Shoe.findOne({
        include: includeOptions,
        where: { [Op.or]: [{ name }, { id: name }] },
      });

      if (!shoe) {
        return res.status(400).send({ message: "shoe not found" });
      }

      const sizeAndStock = shoe.stocks.reduce((prev, curr) => {
        if (prev[curr.shoeSize.size]) {
          prev[curr.shoeSize.size] += curr.stock;
        } else {
          prev[curr.shoeSize.size] = curr.stock;
        }

        return prev;
      }, {});

      const sizeAndStockArray = Object.entries(sizeAndStock).map(
        ([size, stock]) => ({ size, stock })
      );

      return res.status(200).send({ shoe, sizeAndStock: sizeAndStockArray });
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

      await db.Shoe.destroy({ where: { id: req.params.id }, transaction: t });

      await db.ShoeImage.destroy({
        where: { shoe_id: req.params.id },
        transaction: t,
      });

      if (check?.length > 1) {
        const images = check.map((image) => image.shoe_img);
        for (img of images) {
          try {
            fs.unlinkSync(
              path.join(__dirname, `../public/shoe/${img.split("/")[1]}`)
            );
          } catch (err) {
            console.log(err.message);
          }
        }
      } else if (check?.length) {
        try {
          fs.unlinkSync(
            path.join(
              __dirname,
              `../public/shoe/${check.shoe_img.split("/")[1]}`
            )
          );
        } catch (err) {
          console.log(err);
        }
      }

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
      const check = await db.ShoeImage.findAll({
        where: { shoe_id: req.params.id },
      });
      const checkName = await db.Shoe.findOne({
        where: { name: req?.body?.name, id: { [Op.not]: req.params.id } },
      });

      if (checkName) {
        if (req.files.length) {
          try {
            for (const file of req.files) {
              const { filename } = file;
              fs.unlinkSync(path.join(__dirname, `../public/shoe/${filename}`));
            }
          } catch (err) {
            console.log(err);
          }
        }
        return res.status(400).send({ message: "name alrdy exist" });
      }

      await db.Shoe.update(
        {
          name: req?.body?.name,
          description: req?.body?.description,
          price: req?.body?.price,
          weight: req?.body?.weight,
          brand_id: req?.body?.brand_id,
          category_id: req?.body?.category_id,
          subcategory_id: req?.body?.subcategory_id,
        },
        { where: { id: req.params.id }, transaction: t }
      );

      if (req.files && req.files.length > 0) {
        const imageArr = [];
        for (const file of req.files) {
          const filename = file.filename;
          const imageUrl = "shoe/" + filename;
          imageArr.push({ shoe_id: req.params.id, shoe_img: imageUrl });
        }

        await db.ShoeImage.destroy({
          where: { shoe_id: req.params.id },
          transaction: t,
        });
        await db.ShoeImage.bulkCreate(imageArr, { transaction: t });

        if (check?.length) {
          const images = check.map((image) => image.shoe_img);
          for (img of images) {
            try {
              fs.unlinkSync(
                path.join(__dirname, `../public/shoe/${img.split("/")[1]}`)
              );
            } catch (err) {
              console.log(err);
            }
          }
        }
      }

      await t.commit();
      return res.status(200).send({ message: "success update shoe" });
    } catch (err) {
      if (req.files) {
        try {
          for (const file of req.files) {
            const { filename } = file;
            fs.unlinkSync(path.join(__dirname, `../public/shoe/${filename}`));
          }
        } catch (err) {
          console.log(err);
        }
      }
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  setBestSeller: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      console.log(req.body);
      const shoe_ids = req.body.shoe_ids || [];
      console.log(shoe_ids);
      await db.Shoe.update(
        { status: "NORMAL" },
        { where: { status: "BESTSELLER" }, transaction: t }
      );
      for (const id of shoe_ids) {
        await db.Shoe.update(
          { status: "BESTSELLER" },
          { where: { id }, transaction: t }
        );
      }
      await t.commit();
      return res.status(200).send({ message: "Best seller marked" });
    } catch (err) {
      await t.rollback();
      errorResponse(res, err, CustomError);
    }
  },
};

module.exports = shoeController;
