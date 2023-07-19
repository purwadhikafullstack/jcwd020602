const express = require("express");
const router = express.Router();
const stockController = require("../controllers").stockController;

router.post("/", stockController.addStock);
router.get("/", stockController.getStock);
router.patch("/", stockController.editStock);
router.delete("/", stockController.deleteStock);

module.exports = router;
