const db = require("../models");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { Op } = require("sequelize");
module.exports = {
  openCage: async (body) => {
    try {
      const { road, district, city, province, postcode, latitude, longitude } =
        body;
      return await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: {
          q:
            !latitude && !longitude
              ? `${road}, ${city}, ${district} ,${province}, ${postcode}`
              : `${latitude}, ${longitude}`,
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
