const db = require("../models");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const { Op } = require("sequelize");
const {
  titleChecker,
  updatePrimary,
  addressChecker,
  addAddress,
  getAllAddress,
  getEditAddress,
  primaryChecker,
  updateEditPrimary,
} = require("../service/address.service");
const { openCage } = require("../service/opencage.service");
const addressControllers = {
  insertAddress: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const user_id = req.user.id;
      let { title, is_primary } = req.body;
      const titleCheck = await titleChecker(title, user_id);
      if (titleCheck) {
        return res.status(400).send({
          message: "Title already used",
        });
      } else {
        let response = await openCage(req.body);
        const addressCheck = await addressChecker(user_id);
        is_primary = addressCheck.length ? is_primary : true;
        if (is_primary && addressCheck.length) {
          await updatePrimary(t, user_id);
        }
        await addAddress(t, { ...req.body, user_id }, response);
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
      const result = await getAllAddress({
        search: req.query.search,
        user_id: req.user.id,
      });
      return res.status(200).send(result);
    } catch (err) {
      return res.status(500).send({
        message: err.message,
      });
    }
  },
  getAddressToEdit: async (req, res) => {
    try {
      const address = await getEditAddress({
        id: req.query.id,
        user_id: req.user.id,
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
      let { title, address_details, recipient, phone_number, is_primary } =
        req.body;
      const user_id = req.user.id;
      const { id } = req.query;
      const checkAddress = await db.addresses.findOne({
        where: { id },
        raw: true,
      });
      if (checkAddress) {
        if (checkAddress?.user_id == user_id) {
          const checkTitle = await titleChecker(title, user_id);
          if (checkTitle?.id == checkAddress?.id || !checkTitle) {
            let response = await openCage(req.body);
            const checkPrimary = await primaryChecker(user_id);
            if (is_primary && checkPrimary?.id != checkAddress?.id) {
              await updateEditPrimary(t, user_id, checkPrimary.id);
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
      const t = await db.sequelize.transaction();
      let checkAddress = await db.addresses.findOne({
        where: { id: req.query.id },
      });
      if (checkAddress) {
        if (checkAddress.is_primary) {
          return res.status(400).send({
            message: "can't delete primary address.",
          });
        } else if (checkAddress.user_id == req.user.id) {
          await db.addresses.destroy({
            where: { user_id: req.user.id, id: req.query.id },
            transaction: t,
          });
          await t.commit();
          return res.status(200).send({
            success: true,
            message: `Address called ${checkAddress.title} has been deleted!`,
          });
        } else {
          await t.rollback();
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
      await t.rollback();
      return res.status(500).send({ message: error.message });
    }
  },
};
module.exports = addressControllers;
