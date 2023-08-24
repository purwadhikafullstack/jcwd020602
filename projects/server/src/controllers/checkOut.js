const db = require("../models");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { Op } = require("sequelize");
const {
  titleChecker,
  addressChecker,
  updatePrimary,
} = require("../service/address.service");

const openCage = async (address, city, province) => {
  return await axios.get("https://api.opencagedata.com/geocode/v1/json", {
    params: {
      q: `${address}, ${city},${province}`,
      countrycode: "id",
      limit: 1,
      key: process.env.OpenCage_API_KEY,
    },
  });
};

const checkOutControllers = {
  insertAddress: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const user_id = req.user.id;
      let {
        title,
        address,
        address_details,
        phone,
        city_id,
        name,
        is_primary,
      } = req.body;
      const titleCheck = await titleChecker(title, user_id);
      const cityData = await db.City.findOne({
        where: { city_id },
      });
      if (titleCheck) {
        return res.status(400).send({
          message: "Title already used",
        });
      } else {
        const response = await openCage(
          address,
          cityData.dataValues.city_name,
          cityData.dataValues.province
        );
        const addressCheck = await addressChecker(user_id);
        is_primary = false;
        is_primary = addressCheck.length ? is_primary : true;
        if (is_primary && addressCheck.length) {
          await updatePrimary(t, user_id);
        }
        `ini results ${response.data}`;

        const addAddress = await db.Address.create(
          {
            title,
            name,
            phone,
            address,
            address_details,
            city_id,
            user_id,
            is_primary,
            postcode: cityData.dataValues.postal_code,
            latitude: response.data.results[0].geometry.lat,
            longitude: response.data.results[0].geometry.lng,
          },
          { transaction: t }
        );

        await t.commit();
        return res.status(200).send({
          message: "New address data added",
          data: addAddress,
        });
      }
    } catch (error) {
      await t.rollback();
      return res.status(500).send({ success: false, message: error.message });
    }
  },
  getAddress: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 2;

    if (page < 1) {
      return res.status(400).send({ message: "Invalid page number" });
    }

    try {
      const user_id = req.user.id;

      const addressData = await db.Address.findAndCountAll({
        where: { user_id },
        include: [
          {
            model: db.City,
          },
        ],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      return res.status(200).send({
        message: "Get Address Data Successfully",
        data: addressData.rows,
        totalCount: addressData.count,
        totalPages: Math.ceil(addressData.count / pageSize),
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
  chooseAddress: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const user_id = req.user.id;
      const { id } = req.body;

      await db.Address.update({ is_primary: 0 }, { where: { user_id } });

      await db.Address.update({ is_primary: 1 }, { where: { id } });

      await t.commit();
      return res.status(200).send({
        message: "Successfully changing the address",
      });
    } catch (err) {
      await t.rollback();
      res.status(500).send({ message: err.message });
    }
  },
  ongkir: async (req, res) => {
    // const t = await db.sequelize.transaction();
    try {
      const user_id = req.user.id;
      const warehouseData = req.closestWarehouse;
      const { weight, courier } = req.body;

      const addressData = await db.Address.findOne({
        where: { user_id, is_primary: true },
      });

      const result = await axios.post(
        "https://api.rajaongkir.com/starter/cost",
        {
          origin: warehouseData.dataValues.city_id,
          destination: addressData.dataValues.city_id,
          weight,
          courier,
        },
        {
          headers: {
            key: process.env.RajaOngkir_API_KEY,
          },
        }
      );
      const shippingData = result.data.rajaongkir.results[0].costs;

      return res.status(200).send({
        message: "succesfully get delivery data",
        data: shippingData,
      });
    } catch (err) {
      // await t.rollback();
      res.status(500).send({ message: err.message });
    }
  },
};
module.exports = checkOutControllers;
