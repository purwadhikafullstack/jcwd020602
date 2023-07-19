const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers").warehouseController;

router.post("/", warehouseController.addWarehouse);

router.post("/admin/:user_id", warehouseController.addAdminWarehouse);
router.patch("/admin/:user_id", warehouseController.updateAdminWarehouse);
router.delete("/admin/:user_id", warehouseController.deleteAdminWarehouse);

router.get("/", warehouseController.getAll);
router.patch("/:id", warehouseController.editWarehouse);
router.delete("/:id", warehouseController.deleteWarehouse);

module.exports = router;
