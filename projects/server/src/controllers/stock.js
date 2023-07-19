const { Op } = require("sequelize");
const db = require("../models");
const stockController = {
  getStock: async (req, res) => {
    try {
      const limit = 10;
      let offset = 0;

      if (page && parseInt(page) > 1) {
        offset = (parseInt(page) - 1) * limit;
      }

      await db.Stock.findAll({
        where: {
          [Op.and]: [
            {
              warehouse_id: {
                [Op.like]: `%${req.query.warehouse_id || ""}%`,
              },
            },
            {
              "$product.product_name$": {
                [Op.like]: `%${req.query.product_name || ""}%`,
              },
            },
          ],
        },
        include: [{ model: db.products }, { model: db.warehouses }],
      }).then((result) => res.status(200).send(result));
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
