const db = require("../models");
const axios = require("axios");
const moment = require("moment");
const warehouseControllers = {
  insertWarehouse: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      let { name, road, province, city, district, postcode, telephone_number } =
        req.body;
      let response = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q: `${road}, ${city}, ${district} ,${province}, ${postcode}`,
            countrycode: "id",
            limit: 1,
            key: "aa5cafb42d7849fda849d111ba6aa773",
          },
        }
      );
      let createNewWarehouse = await db.warehouses.create(
        {
          name,
          address: response.data.results[0].formatted,
          road: response.data.results[0].components.road,
          province:
            response.data.results[0].components.state ||
            response.data.results[0].components.region,
          city:
            response.data.results[0].components.city ||
            response.data.results[0].components.city_district,
          district:
            response.data.results[0].components.district ||
            response.data.results[0].components.suburb ||
            response.data.results[0].components.subdistrict,
          postcode: response.data.results[0].components.postcode,
          telephone_number,
          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).send({
        success: true,
        message: "New warehouse data added",
        dataAPI: response.data.results[0],
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).send({ message: error.message });
    }
  },
  updateWarehouse: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      let { name, road, province, city, district, postcode, telephone_number } =
        req.body;
      let response = await axios.get(
        "https://api.opencagedata.com/geocode/v1/json",
        {
          params: {
            q: `${road}, ${city}, ${district} ,${province}, ${postcode}`,
            countrycode: "id",
            limit: 1,
            key: "aa5cafb42d7849fda849d111ba6aa773",
          },
        }
      );
      let checkUser = await db.users.findOne({
        where: { id: req.params.id },
        raw: true,
      });
      const checkWarehouse = await db.warehouses.findOne({
        where: { id: req.params.id },
      });
      if (checkWarehouse) {
        if (checkUser.role == "SUPER_ADMIN") {
          let createNewWarehouse = await db.warehouses.update(
            {
              name,
              address: response.data.results[0].formatted,
              road: response.data.results[0].components.road,
              province:
                response.data.results[0].components.state ||
                response.data.results[0].components.region,
              city:
                response.data.results[0].components.city_district ||
                response.data.results[0].components.city,
              district:
                response.data.results[0].components.district ||
                response.data.results[0].components.suburb ||
                response.data.results[0].components.subdistrict,
              postcode: response.data.results[0].components.postcode,
              telephone_number,
              latitude: response.data.results[0].geometry.lat,
              longitude: response.data.results[0].geometry.lng,
            },
            { where: { id: req.params.id }, transaction: t }
          );
          await t.commit();
          return res.status(200).send({
            success: true,
            message: `Warehouse ${checkWarehouse.name} has been updated `,
            dataAPI: response.data.results[0],
          });
        } else {
          res.status(400).send({
            message: "You are not a super admin.",
          });
        }
      } else {
        return res.status(400).send({ message: "warehouse not found" });
      }
    } catch (error) {
      await t.rollback();
      return res.status(500).send({ message: error.message });
    }
  },
  deleteWarehouse: async (req, res) => {
    try {
      let checkUser = await db.users.findOne({
        where: { id: req.params.id },
        raw: true,
      });
      let checkWarehouse = await db.warehouses.findOne({
        where: { id: req.query.id },
      });
      if (checkWarehouse) {
        if (checkUser.role == "SUPER_ADMIN") {
          let deleteWarehouse = await db.warehouses.destroy({
            where: { id: req.params.id },
          });
        } else {
          res.status(400).send({
            message: "You are not a super admin.",
          });
        }
      } else {
        res.status(400).send({
          message: "Warehouse not found.",
        });
      }

      res.status(200).send({
        success: true,
        message: `Warehouse ${checkWarehouse} has been deleted!`,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  getAllWarehouses: async (req, res) => {
    try {
      let warehouseData = await db.warehouses.findAll({
        raw: true,
      });
      res.status(200).send(warehouseData);
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
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
