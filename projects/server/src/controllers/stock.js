const { Op } = require("sequelize");
const db = require("../models");
const stockController = {
  getStock: async (req, res) => {
    try {
      const limit = 1;
      const page = req?.query?.page || 1;
      let offset = (parseInt(page) - 1) * limit;
      const sort = req?.query?.sort || "id";
      const order = req?.query?.order || "ASC";
      const search = req?.query?.search || "";
      const province = req?.query?.province || "";
      const city = req?.query?.city || "";

      db.Stock.findAndCountAll({
        where: {
          [Op.and]: [
            { "$sho.name$": { [Op.like]: `%${search}%` } },
            {
              [Op.or]: [
                { "$warehouse.city$": { [Op.like]: `%${city}%` } },
                { "$warehouse.province$": { [Op.like]: `%${province}%` } },
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
        order: [[sort, order]],
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
    try {
      const { qty } = req.body;
      const { id } = req.params;

      await db.Stock.update(
        {
          qty,
        },
        {
          where: { id },
        }
      );
      res.send({ message: "Stock updated successfully" });
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
  deleteStock: async (req, res) => {
    try {
      await db.Stock.destroy({ where: { id: req.params.id } });
      return res.status(200).send({
        message: "Stock deleted successfully",
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
};

module.exports = stockController;
