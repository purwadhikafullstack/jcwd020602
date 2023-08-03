const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers").warehouseController;
const roleDecoder = require("../middlewares/roleDecoder");

router.post("/", roleDecoder.checkSuper, warehouseController.addWarehouse);

router.post(
  "/admin/:user_id",
  roleDecoder.checkSuper,
  warehouseController.addAdminWarehouse
);
router.patch(
  "/admin/:user_id",
  roleDecoder.checkSuper,
  warehouseController.updateAdminWarehouse
);
router.delete(
  "/admin/:user_id",
  roleDecoder.checkSuper,
  warehouseController.deleteAdminWarehouse
);

router.get("/", roleDecoder.checkAdmin, warehouseController.getAll);
router.get("/prov", roleDecoder.checkAdmin, warehouseController.getProv);
router.get("/city", roleDecoder.checkAdmin, warehouseController.getCity);
router.get("/:id", roleDecoder.checkAdmin, warehouseController.getById);
router.patch("/:id", roleDecoder.checkSuper, warehouseController.editWarehouse);
router.delete(
  "/:id",
  roleDecoder.checkSuper,
  warehouseController.deleteWarehouse
);

module.exports = router;
