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
      const { name, phone, province, city, address } = req.body;
      const response = await opencage(address, city, province);
      console.log(response.data.results[0]);
      const warehouse = await db.Warehouse.create(
        {
          name,
          phone,
          address: response.data.results[0].formatted,
          province:
            response.data.results[0].components?.state ||
            response.data.results[0].components?.region ||
            province,
          city:
            response.data.results[0].components.city ||
            response.data.results[0].components.city_district ||
            city,
          postcode: response.data.results[0].components.postcode,
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
      await db.Warehouse.findAll({
        include: [
          {
            model: db.Admin,
            attributes: ["user_id"],
            include: [db.User],
          },
        ],
      }).then((result) => res.status(200).send(result));
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  deleteWarehouse: async (req, res) => {
    try {
      await db.Warehouse.destroy({
        where: {
          id: req.params.id,
        },
      });
      return res.status(200).send({ message: "warehouse has been deleted" });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  editWarehouse: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { name, phone, province, city, address } = req.body;
      const response = await opencage(address, city, province);
      console.log(response.data.results[0]);
      const warehouse = await db.Warehouse.update(
        {
          name,
          phone,
          address:
            response?.data?.results[0]?.formatted == null
              ? address
              : response?.data?.results[0]?.formatted,
          province:
            response.data.results[0].components.state ||
            response.data.results[0].components.region,
          city:
            response.data.results[0].components.city ||
            response.data.results[0].components.city_district,
          postcode: response.data.results[0].components.postcode,
          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
        },
        {
          where: {
            id: req.params.id,
          },
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({
        data: warehouse,
        message: "success update Warehouse",
      });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  addAdminWarehouse: async (req, res) => {
    try {
      const { user_id } = req.params;
      const admin = await db.Admin.create({
        warehouse_id: req.body.warehouse_id,
        user_id,
      });

      const user = await db.User.findOne({
        where: {
          id: user_id,
        },
      });

      if (user) {
        user.assign = true;
        await user.save();
      }

      return res
        .status(200)
        .send({ data: admin, message: "success assign admin" });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  updateAdminWarehouse: async (req, res) => {
    try {
      const { user_id } = req.params;
      const { warehouse_id } = req.body;

      await db.Admin.update(
        {
          warehouse_id,
        },
        {
          where: {
            user_id,
          },
        }
      );
      return res.status(200).send({ message: "success reassign admin" });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  deleteAdminWarehouse: async (req, res) => {
    const { user_id } = req.params;
    try {
      await db.Admin.destroy({
        where: {
          user_id,
        },
      });

      const user = await db.User.findOne({
        where: {
          id: user_id,
        },
      });

      if (user) {
        user.assign = false;
        await user.save();
      }
      return res.status(200).send({ message: "success unassign admin" });
    } catch (err) {
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
};

module.exports = warehouseControllers;
