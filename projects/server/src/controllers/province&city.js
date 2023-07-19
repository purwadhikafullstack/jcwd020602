const db = require("../models");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const provinceCityControllers = {
  addProvinceData: async (req, res) => {
    try {
      const response = await axios.get(
        "https://api.rajaongkir.com/starter/province",
        {
          headers: { key: process.env.RajaOngkir_API_KEY },
        }
      );
      await db.Province.bulkCreate(response.data.rajaongkir.results);
      return res.status(200).send(response.data.rajaongkir.results);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },

  addCityData: async (req, res) => {
    try {
      const response = await axios.get(
        "https://api.rajaongkir.com/starter/city",
        {
          headers: { key: process.env.RajaOngkir_API_KEY },
        }
      );
      await db.City.bulkCreate(response.data.rajaongkir.results);
      return res.status(200).send(response.data.rajaongkir.results);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  getAllProv: async (req, res) => {
    try {
      const getProv = await db.Province.findAll({ raw: true });
      return res.status(200).send(getProv);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  getCityByProv: async (req, res) => {
    try {
      const getCity = await db.City.findAll({
        where: {
          province_id: req.params.province_id,
        },
        raw: true,
      });
      return res.status(200).send(getCity);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};

module.exports = provinceCityControllers;
