const express = require("express");
const router = express.Router();
const stockHistoryController = require("../controllers").stockHistoryController;
const roleDecoder = require("../middlewares/roleDecoder");

router.get("/", roleDecoder.checkAdmin, stockHistoryController.getStockHistory);

module.exports = router;
