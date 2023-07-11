const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers").warehouseController;

router.post("/add", warehouseController.insertWarehouse);
router.post("/", warehouseController.getCostData);
router.get("/", warehouseController.getAllWarehouses);
module.exports = router;
