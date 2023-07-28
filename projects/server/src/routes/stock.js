const express = require("express");
const router = express.Router();
const stockController = require("../controllers").stockController;

router.post("/", stockController.addStock);
router.get("/", stockController.getStock);
router.get(
  "/:id",
  stockController.getStockById,
  stockController.getStockFromId
);
router.patch("/:id", stockController.getStockById, stockController.editStock);
router.delete(
  "/:id",
  stockController.getStockById,
  stockController.deleteStock
);

module.exports = router;
