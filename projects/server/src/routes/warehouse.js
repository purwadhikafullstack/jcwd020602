const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers").warehouseController;

router.post("/", warehouseController.insertWarehouse);
router.get("/", warehouseController.getAllWarehouses);
router.patch("/", warehouseController.updateWarehouse);
router.delete("/", warehouseController.deleteWarehouse);

module.exports = router;
