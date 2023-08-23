const express = require("express");
const router = express.Router();
const provinceCityController = require("../controllers").provinceCityController;

router.post("/prov", provinceCityController.addProvinceData);
router.post("/city", provinceCityController.addCityData);
router.get("/city/:province_id", provinceCityController.getCityByProv);
router.get("/prov", provinceCityController.getAllProv);

module.exports = router;
