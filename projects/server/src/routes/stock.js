const express = require("express");
const router = express.Router();
const stockController = require("../controllers").stockController;
const roleDecoder = require("../middlewares/roleDecoder");

router.post("/", roleDecoder.checkAdmin, stockController.addStock);
router.get("/", roleDecoder.checkAdmin, stockController.getStock);
router.get(
  "/fromStock",
  roleDecoder.checkAdmin,
  stockController.getStockByWarehouse
);
router.get(
  "/:id",
  roleDecoder.checkAdmin,
  stockController.getStockById,
  stockController.getStockFromId
);
router.patch(
  "/:id",
  roleDecoder.checkAdmin,
  stockController.getStockById,
  stockController.editStock
);
router.delete(
  "/:id",
  roleDecoder.checkAdmin,
  stockController.getStockById,
  stockController.deleteStock
);

module.exports = router;
