const db = require("../models");

const shoeSizeControllers = {
  addShoeSize: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { size } = req.body;
      const findSize = await db.ShoeSize.findOne({
        where: {
          size,
        },
      });
      if (findSize) {
        const shoeSize = await db.ShoeSize.create({ size }, { transaction: t });
        await t.commit();
        return res.status(200).send({
          message: "stock registered",
        });
      } else {
        return res.status(200).send("size already exist");
      }
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  getAll: async (req, res) => {
    try {
      const shoeSizes = await db.ShoeSize.findAll({
        attributes: ["size", "id"],
      });
      res.status(200).send(shoeSizes);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
  deleteShoeSize: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const deleteSize = await db.ShoeSize.destroy({
        where: {
          size: req.query.size,
        },
        transaction: t,
      });
      t.commit();
      return res.status(200).send("delete success");
    } catch (err) {
      await t.rollback();
      res.status(500).send({
        message: err.message,
      });
    }
  },
};

module.exports = shoeSizeControllers;
