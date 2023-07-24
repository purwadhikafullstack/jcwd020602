const { Op } = require("sequelize");
const db = require("../models");
const stockController = {
  getStock: async (req, res) => {
    try {
      const limit = 2;
      const page = req?.query?.page || 1;
      let offset = (parseInt(page) - 1) * limit;
      let sort = req?.query?.sort || "id";
      const order = req?.query?.order || "ASC";
      const search = req?.query?.search || "";
      const city = req?.query?.city || "";
      switch (sort) {
        case "brand":
          sort = [
            { model: db.Shoe, include: [{ model: db.Brand }] },
            { model: db.Brand },
            "name",
          ];
          break;
        case "name":
          sort = [{ model: db.Shoe }, "name"];
          break;
        case "size":
          sort = [{ model: db.ShoeSize }, "size"];
          break;
        default:
          sort = [sort];
          break;
      }
      db.Stock.findAndCountAll({
        where: {
          [Op.and]: [
            { "$warehouse.city$": { [Op.like]: `%${city}%` } },
            {
              [Op.or]: [
                { "$sho.name$": { [Op.like]: `%${search}%` } },
                { "$sho.brand.name$": { [Op.like]: `%${search}%` } },
              ],
            },
          ],
        },
        include: [
          {
            model: db.Shoe,
            include: [{ model: db.Brand }],
          },
          { model: db.ShoeSize },
          { model: db.Warehouse },
        ],
        limit,
        offset,
        order: [[...sort, order]],
      }).then((result) =>
        res
          .status(200)
          .send({ ...result, totalPages: Math.ceil(result.count / limit) })
      );
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err.message });
    }
  },
  addStock: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { stock, shoe_id, shoe_size_id, warehouse_id } = req.body;
      await db.Stock.create(
        {
          stock,
          shoe_id,
          shoe_size_id,
          warehouse_id,
        },
        { transaction: t }
      ).then((result) => res.status(200).send(result));
      await t.commit();
    } catch (err) {
      await t.rollback();
      res.status(500).send({
        message: err.message,
      });
    }
  },
  editStock: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { stock, shoe_id, shoe_size_id, warehouse_id } = req.body;
      const { id } = req.params;

      await db.Stock.update(
        {
          stock,
          shoe_id,
          shoe_size_id,
          warehouse_id,
        },
        {
          where: { id },
          transaction: t,
        }
      );
      await t.commit();
      res.send({ message: "Stock updated successfully" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  deleteStock: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await db.Stock.destroy({ where: { id: req.params.id } });
      await t.commit();
      return res.status(200).send({
        message: "Stock deleted successfully",
      });
    } catch (err) {
      await t.rollback();
      res.status(500).send({ message: err.message });
    }
  },
  getStockById: async (req, res) => {
    try {
      const stock = await db.Stock.findOne({
        where: { id: req.params.id },
        include: [
          {
            model: db.Shoe,
            include: [{ model: db.Brand }],
          },
          { model: db.ShoeSize },
          { model: db.Warehouse },
        ],
      });
      return res.status(200).send(stock);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
};

module.exports = stockController;
