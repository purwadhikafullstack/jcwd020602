const db = require("../models");
const axios = require("axios");
const opencage = async (address, city, province) => {
  return await axios.get("https://api.opencagedata.com/geocode/v1/json", {
    params: {
      q: `${address}, ${city},${province}`,
      countrycode: "id",
      limit: 1,
      key: process.env.OpenCage_API_KEY,
    },
  });
};

const warehouseControllers = {
  addWarehouse: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name, phone, city_id, address } = req.body;
      const city = await db.City.findOne({
        where: { city_id },
      });
      const response = await opencage(
        address,
        city.dataValues.city_name,
        city.dataValues.province
      );
      const warehouse = await db.Warehouse.create(
        {
          name,
          phone,
          address: `${address}, ${city.dataValues.city_name}, ${city.dataValues.province}, ${city.dataValues.postal_code}`,
          province_id: city.dataValues.province_id,
          city_id: city_id,
          postcode: city.dataValues.postal_code,
          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({
        data: warehouse,
        message: "success create new Warehouse",
      });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  getAll: async (req, res) => {
    try {
      const warehouses = await db.Warehouse.findAll({
        include: [
          {
            model: db.Admin,
            attributes: ["user_id"],
            include: [db.User],
          },
        ],
      });
      return res.status(200).send(warehouses);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  getById: async (req, res) => {
    const warehouse = await db.Warehouse.findOne({
      where: { id: req.params.id },
      include: [{ model: db.City }],
    });
    return res.status(200).send(warehouse);
  },
  deleteWarehouse: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      await db.Warehouse.destroy(
        { where: { id: req.params.id } },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({ message: "warehouse has been deleted" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  editWarehouse: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name, phone, city_id, address } = req.body;
      const city = await db.City.findOne({
        where: { city_id },
      });
      if (city) {
        const response = await opencage(
          address,
          city.dataValues.city_name,
          city.dataValues.province
        );
        await db.Warehouse.update(
          {
            name,
            phone,
            address: `${address}, ${city.dataValues.city_name}, ${city.dataValues.province}, ${city.dataValues.postal_code}`,
            province_id: city.dataValues.province_id,
            city_id: city.dataValues.city_id,
            postcode: city.dataValues.postal_code,
            latitude: response.data.results[0].geometry.lat,
            longitude: response.data.results[0].geometry.lng,
          },
          { where: { id: req.params.id } },
          { transaction: t }
        );
      } else {
        res.status(500).send({
          message: "city doesn't exist",
        });
      }
      await t.commit();
      return res.status(200).send({ message: "success update Warehouse" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  addAdminWarehouse: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { user_id } = req.params;
      await db.Admin.create(
        { warehouse_id: req.body.warehouse_id, user_id },
        { transaction: t }
      );
      const user = await db.User.findOne({
        where: { id: user_id },
      });
      if (user) {
        user.assign = true;
        await user.save({ transaction: t });
        await db.User.update(
          { warehouse_id: req.body.warehouse_id },
          { where: { id: user_id } },
          { transaction: t }
        );
      }
      await t.commit();
      return res.status(200).send({ message: "success assign admin" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  updateAdminWarehouse: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { user_id } = req.params;
      const { warehouse_id } = req.body;

      await db.Admin.update(
        { warehouse_id },
        { where: { user_id } },
        { transaction: t }
      );
      await db.User.update({ warehouse_id }, { where: { id: user_id } });
      await t.commit();
      return res.status(200).send({ message: "success reassign admin" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  deleteAdminWarehouse: async (req, res) => {
    const { user_id } = req.params;
    const t = await db.sequelize.transaction();
    try {
      await db.Admin.destroy({ where: { user_id } }, { transaction: t });

      const user = await db.User.findOne({ where: { id: user_id } });

      if (user) {
        user.assign = false;
        await user.save();
      }
      await t.commit();
      return res.status(200).send({ message: "success unassign admin" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  getCostData: async (req, res) => {
    try {
      const { origin, destination, weight, courier } = req.body;
      const response = await axios.post(
        "https://api.rajaongkir.com/starter/cost",
        {
          origin: origin,
          destination: destination,
          weight: weight,
          courier: courier,
        },
        {
          headers: {
            key: "c44434f326fbc4a4e77b699e76323c32",
          },
        }
      );
      res.status(200).send(response.data);
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  },
  getProv: async (req, res) => {
    try {
      db.Warehouse.findAll({
        include: [
          {
            model: db.City,
            attributes: ["province_id", "province"],
          },
        ],
        distinc: true,
      }).then((result) => res.status(200).send(result));
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  getCity: async (req, res) => {
    try {
      db.Warehouse.findAll({
        include: [
          { model: db.City, attributes: ["city_id", "city_name", "type"] },
        ],
        where: {
          "$city.province$": req.query.province,
        },
        distinc: true,
      }).then((result) => res.status(200).send(result));
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
};

module.exports = warehouseControllers;
