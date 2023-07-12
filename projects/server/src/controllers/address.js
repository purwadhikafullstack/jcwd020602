const db = require("../models");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { Op } = require("sequelize");
const addressControllers = {
  insertAddress: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { user_id } = req.params;
      let {
        title,
        address_details,
        road,
        district,
        city,
        province,
        postcode,
        latitude,
        longitude,
        recipient,
        phone_number,
        is_primary,
      } = req.body;
      const titleChecker = await db.addresses.findOne({
        where: {
          title,
          user_id,
        },
      });
      if (titleChecker) {
        return res.status(400).send({
          message: "Title already used",
        });
      } else {
        let response = await axios.get(
          "https://api.opencagedata.com/geocode/v1/json",
          {
            params: {
              q:
                !latitude && !longitude
                  ? `${road}, ${city}, ${district} ,${province}, ${postcode}`
                  : `${latitude}, ${longitude}`,
              countrycode: "id",
              limit: 1,
              key: process.env.OpenCage_API_KEY,
            },
          }
        );
        const addressChecker = await db.addresses.findAll({
          where: {
            user_id,
          },
          raw: true,
        });
        is_primary = addressChecker.length ? is_primary : true;
        if (is_primary && addressChecker.length) {
          await db.addresses.update(
            {
              is_primary: false,
            },
            {
              where: {
                user_id,
                is_primary: true,
              },
              transaction: t,
            }
          );
        }
        let createNewAddress = await db.addresses.create(
          {
            title,
            address_details,
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
            latitude: response.data.results[0].geometry.lat,
            longitude: response.data.results[0].geometry.lng,
            recipient,
            phone_number,
            is_primary,
            user_id,
          },
          { transaction: t }
        );
        await t.commit();
        return res.status(200).send({
          success: true,
          message: "New address data added",
          dataAPI: response.data.results[0],
        });
      }
    } catch (error) {
      await t.rollback();
      return res.status(500).send({ success: false, message: error.message });
    }
  },
  getAddressUser: async (req, res) => {
    try {
      const { user_id } = req.params;
      const { search } = req.query;
      const where = {
        [Op.and]: [
          {
            [Op.or]: [
              {
                title: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                address: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                road: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                district: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                city: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                province: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                postcode: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                recipient: {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                phone_number: {
                  [Op.like]: "%" + search + "%",
                },
              },
            ],
          },
          { user_id },
        ],
      };
      const result = await db.addresses.findAll({
        where: where,
        order: [["is_primary", "DESC"]],
      });
      return res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  getAddressToEdit: async (req, res) => {
    try {
      const address = await db.addresses.findOne({
        where: {
          id: req.query.id,
          user_id: req.params.user_id,
        },
      });
      if (!address) {
        return res.status(404).send({ message: "Address not found" });
      }
      return res.status(200).send(address);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: error.message });
    }
  },
  updateAddress: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      let {
        title,
        address_details,
        road,
        district,
        city,
        province,
        postcode,
        latitude,
        longitude,
        recipient,
        phone_number,
        is_primary,
      } = req.body;
      const { user_id } = req.params;
      const { id } = req.query;
      const checkAddress = await db.addresses.findOne({
        where: { id },
        raw: true,
      });
      if (checkAddress) {
        if (checkAddress.user_id == user_id) {
          const checkTitle = await db.addresses.findOne({
            where: { title, user_id },
            raw: true,
          });
          if (checkTitle?.id == checkAddress.id || !checkTitle) {
            let response = await axios.get(
              "https://api.opencagedata.com/geocode/v1/json",
              {
                params: {
                  q:
                    !latitude && !longitude
                      ? `${road}, ${city}, ${district} ,${province}, ${postcode}`
                      : `${latitude}, ${longitude}`,
                  countrycode: "id",
                  limit: 1,
                  key: process.env.OpenCage_API_KEY,
                },
              }
            );
            const checkPrimary = await db.addresses.findOne({
              where: {
                is_primary: true,
                user_id,
              },
              raw: true,
            });
            if (is_primary && checkPrimary?.id != checkAddress?.id) {
              await db.addresses.update(
                {
                  is_primary: false,
                },
                {
                  where: {
                    id: checkPrimary.id,
                    is_primary: true,
                    user_id,
                  },
                  transaction: t,
                }
              );
            }
            if (checkPrimary?.id == checkAddress?.id && !is_primary) {
              return res
                .status(400)
                .send({ message: "you must have a primary address" });
            }
            let editAddress = await db.addresses.update(
              {
                title: title ? title : checkAddress.title,
                address_details: address_details
                  ? address_details
                  : checkAddress.address_details,
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
                latitude: response.data.results[0].geometry.lat,
                longitude: response.data.results[0].geometry.lng,
                recipient: recipient ? recipient : checkAddress.recipient,
                phone_number: phone_number
                  ? phone_number
                  : checkAddress.phone_number,
                is_primary,
              },
              { where: { id, user_id }, transaction: t }
            );
            await t.commit();
            return res.status(200).send({
              success: true,
              message: `address ${checkAddress.title} has been updated`,
              dataAPI: response.data.results[0],
            });
          } else {
            return res
              .status(400)
              .send({ message: "title already used in other address" });
          }
        } else {
          return res
            .status(400)
            .send({ message: "you do not have access to this address" });
        }
      } else {
        return res.status(400).send({ message: "address not found" });
      }
    } catch (error) {
      await t.rollback();
      return res.status(500).send({ message: error.message });
    }
  },
  deleteAddress: async (req, res) => {
    try {
      let checkAddress = await db.addresses.findOne({
        where: { id: req.query.id },
      });
      if (checkAddress) {
        if (checkAddress.is_primary) {
          return res.status(400).send({
            message: "can't delete primary address.",
          });
        } else if (checkAddress.user_id == req.params.user_id) {
          let deleteAddress = await db.addresses.destroy({
            where: { user_id: req.params.user_id, id: req.query.id },
          });
          return res.status(200).send({
            success: true,
            message: `Address called ${checkAddress.title} has been deleted!`,
          });
        } else {
          return res.status(400).send({
            message: "can't delete other user's address.",
          });
        }
      } else {
        return res.status(400).send({
          message: "Address not found.",
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
module.exports = addressControllers;
