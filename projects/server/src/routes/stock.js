const express = require("express");
const router = express.Router();
const stockController = require("../controllers").stockController;

router.post("/", stockController.addStock);
router.get("/", stockController.getStock);
router.get("/:id", stockController.getStockById);
router.patch("/:id", stockController.editStock);
router.delete("/:id", stockController.deleteStock);

module.exports = router;
