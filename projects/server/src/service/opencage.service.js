const db = require("../models");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { Op } = require("sequelize");
module.exports = {
  openCage: async (address, city, province) => {
    try {
      // const { address, city, province } = body;
      // console.log(address);
      // console.log(city);
      // console.log(province);
      return await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: {
          q:
            // !latitude && !longitude
            `${address}, ${city},${province}`,
          // : `${latitude}, ${longitude}`,
          countrycode: "id",
          limit: 1,
          key: process.env.OpenCage_API_KEY,
        },
      });
    } catch (err) {
      return err;
    }
  },
};
