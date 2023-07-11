const express = require("express");
const router = express.Router();
const getAllStockHistory = require("../controllers").getAllStockHistory;

router.get("/stockHistory", getAllStockHistory.getAllHistories);

module.exports = router;
