const express = require("express");
const router = express.Router();
const stockHistoryController = require("../controllers").stockHistoryController;

router.get("/", stockHistoryController.getStockHistory);

module.exports = router;
