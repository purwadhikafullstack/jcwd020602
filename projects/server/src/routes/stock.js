const express = require("express");
const router = express.Router();
const stockController = require("../controllers").stockController;
const roleDecoder = require("../middlewares/roleDecoder");
const {
  validateStock,
  validateEditStock,
} = require("../middlewares/validator");

//post new stock
router.post(
  "/",
  roleDecoder.checkAdmin,
  validateStock,
  stockController.addStock
);
//all stock data with filtering
router.get("/", roleDecoder.checkAdmin, stockController.getStock);
//stock data spesifically to select stock_id based on warehouse and create stock mutation
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
  validateEditStock,
  stockController.editStock
);
router.delete(
  "/:id",
  roleDecoder.checkAdmin,
  stockController.getStockById,
  stockController.deleteStock
);

module.exports = router;
