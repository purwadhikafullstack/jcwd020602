const db = require("../models");
const axios = require("axios");
const {
  addWarehouse,
  updateWarehouse,
  validWarehouse,
  getAllWarehouse,
} = require("../service/warehouse.service");
const { openCage } = require("../service/opencage.service");
const warehouseControllers = {
  insertWarehouse: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      let { name, road, province, city, district, postcode, telephone_number } =
        req.body;
      if (req?.user?.role != "SUPER_ADMIN") {
        return res.status(400).send({
          message: `user ${req?.user?.full_name} is not a super admin, but a ${req?.user?.role}`,
        });
      } else {
        const nameChecker = await db.warehouses.findOne({ where: { name } });
        if (!nameChecker) {
          let response = await openCage(req.body);
          let createNewWarehouse = await addWarehouse(t, req.body, response);
          await t.commit();
          return res.status(200).send({
            success: true,
            message: "New warehouse data added",
            dataAPI: response.data.results[0],
          });
        } else {
          return res.status(400).send({ message: "name already used" });
        }
      }
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
      if (req?.user?.role != "SUPER_ADMIN") {
        return res.status(400).send({
          message: `user ${req?.user?.full_name} is not a super admin, but a ${req?.user?.role}`,
        });
      } else {
        const checkWarehouse = await validWarehouse(req.query.id);
        if (checkWarehouse) {
          const checkName = await db.warehouses.findOne({
            where: { name },
            raw: true,
          });
          if (checkName?.id != checkWarehouse?.id) {
            let response = await openCage(req.body);
            await updateWarehouse(
              req.query.id,
              t,
              checkWarehouse,
              { name, telephone_number },
              response
            );
            await t.commit();
            return res.status(200).send({
              success: true,
              message: `Warehouse ${checkWarehouse.name} has been updated `,
              dataAPI: response.data.results[0],
            });
          } else {
            return res
              .status(400)
              .send({ message: `warehouse named ${name} already exist` });
          }
        } else {
          return res.status(400).send({ message: "warehouse not found" });
        }
      }
    } catch (error) {
      await t.rollback();
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  },
  deleteWarehouse: async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
      if (req?.user?.role != "SUPER_ADMIN") {
        return res.status(400).send({
          message: `user ${req?.user?.full_name} is not a super admin, but a ${req?.user?.role}`,
        });
      } else {
        const checkWarehouse = await validWarehouse(req.query.id);
        if (checkWarehouse) {
          await db.warehouses.destroy({
            where: { id: req.query.id },
            transaction: t,
          });
          await t.commit();
          return res.status(200).send({
            success: true,
            message: `Warehouse ${checkWarehouse.name} has been deleted!`,
          });
        } else {
          return res.status(400).send({
            message: "Warehouse not found.",
          });
        }
      }
    } catch (error) {
      await t.rollback();
      return res.status(500).send({ message: error.message });
    }
  },
  getAllWarehouses: async (req, res) => {
    try {
      if (req?.user?.role != "SUPER_ADMIN") {
        return res.status(400).send({
          message: `user ${req?.user?.full_name} is not a super admin, but a ${req?.user?.role}`,
        });
      } else {
        const page = parseInt(req.query.page) || 0;
        const limit = 5;
        const offset = limit * page;
        const sort = req.query.sort || "id";
        const order = req.query.order || "ASC";
        const keyword = req.query.keyword || "";
        const with_admin = req.query.with_admin || "";

        let WarehouseData = await getAllWarehouse({
          sort,
          order,
          keyword,
          with_admin,
        });
        WarehouseData.rows = WarehouseData.rows.slice(offset, offset + limit);
        res.status(200).send({
          ...WarehouseData,
          totalPage: Math.ceil(WarehouseData.count / limit),
        });
      }
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  },
  getWarehouseDetails: async (req, res) => {
    try {
      let data = await validWarehouse(req.query.id);
      let adminAssigned = [];
      if (data) {
        adminAssigned = await db.users.findAll({
          where: { warehouse_id: data.id },
        });
      }
      return res.status(200).send({
        success: true,
        message: "Ok",
        data,
        adminAssigned,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: err.message });
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
