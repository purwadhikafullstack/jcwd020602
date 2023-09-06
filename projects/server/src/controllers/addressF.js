const db = require("../models");
const { Op } = require("sequelize");
const { openCage } = require("../service/opencage.service");
const {
  nameChecker,
  addressChecker,
  titleChecker,
  addAddress,
  updatePrimary,
  primaryChecker,
  updateEditPrimary,
  editAddress,
} = require("../service/address.service");
const { ValidationError, CustomError } = require("../utils/customErrors");
const { errorResponse } = require("../utils/function");

//-------------------------------------------------- DONE CLEAN CODE! -FAHMI
const addressFControllers = {
  addAddress: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const user_id = req.user.id;
      let { title, name, address, is_primary, city_id } = req.body;
      const nameCheck = await nameChecker(name, user_id);
      const titleCheck = await titleChecker(title, user_id);

      if (nameCheck) {
        return res.status(400).send({ message: "name already used" });
      }
      if (titleCheck) {
        return res.status(400).send({ message: "title already used" });
      }
      const city = await db.City.findOne({ where: { city_id } });
      const postcode = city?.dataValues?.postal_code;
      const response = await openCage(
        address,
        city.dataValues.city_name,
        city.dataValues.province
      );

      const addressCheck = await addressChecker(user_id);
      is_primary = addressCheck.length ? is_primary : true;

      if (is_primary && addressCheck?.length) {
        await updatePrimary(t, user_id);
      }

      await addAddress(
        t,
        { ...req.body, user_id, postcode, is_primary },
        response
      );

      await t.commit();
      return res.status(200).send({ message: "New address added" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send({ message: err.message });
    }
  },
  getAddressUser: async (req, res) => {
    try {
      const user_id = req.user.id;
      const address = await db.Address.findAll({
        include: [db.City],
        where: { user_id },
      });
      return res.status(200).send(address);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  },
  deleteAddress: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      const { title, user_id } = req.query;
      const addressToDelete = await titleChecker(title, user_id, "");

      if (!addressToDelete) {
        return res.status(404).send({ message: "Address not found" });
      }

      let updatePrimary = false;
      if (addressToDelete.is_primary === true) {
        const otherAddress = await db.Address.findOne({
          where: { user_id, id: { [Op.not]: addressToDelete.id } },
        });

        if (otherAddress) {
          await db.Address.update(
            { is_primary: true },
            { where: { id: otherAddress.id }, transaction: t }
          );
          updatePrimary = true;
        }
      }

      await db.Address.destroy({
        where: { id: addressToDelete.id },
        transaction: t,
      });

      await t.commit();
      return res.status(200).send({ message: "success delete address" });
    } catch (err) {
      await t.rollback();
      return res.status(500).send(err.message);
    }
  },
  editAddress: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      let { id, title, name, address, is_primary, city_id, user_id } = req.body;
      const titleCheck = await titleChecker(title, user_id, id);
      const nameCheck = await nameChecker(name, user_id, id);
      let error;
      if (titleCheck) {
        throw new ValidationError("Title already exist");
      }
      if (nameCheck) {
        throw new ValidationError("Name already exist");
      }
      const checkPrimary = await primaryChecker(user_id); //findOne
      const checkAddress = await db.Address.findOne({
        where: { id },
        raw: true,
      });

      if (!is_primary && id == checkPrimary.id) {
        throw new ValidationError("you need  1 default address");
      } else if (is_primary && checkPrimary.id != checkAddress.id) {
        await updateEditPrimary(t, user_id, checkPrimary.id); //upadate default address menjadi isprimary=false
      }
      const city = await db.City.findOne({ where: { city_id } });
      const postcode = city.dataValues.postal_code;
      const response = await openCage(
        address,
        city.dataValues.city_name,
        city.dataValues.province
      );
      await editAddress(t, { ...req.body, postcode }, response);

      await t.commit();
      return res.status(200).send({ message: "success update address" });
    } catch (err) {
      await t.rollback();
      return errorResponse(res, err, CustomError);
    }
  },
};

module.exports = addressFControllers;
