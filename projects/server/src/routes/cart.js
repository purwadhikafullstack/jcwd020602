const express = require("express");
const router = express.Router();
const cartController = require("../controllers").cartController;
const tokenDecoder = require("../middlewares/tokenDecoder");

// MENAMBAHKAN PRODUCT TO CART
router.post("/addCart", tokenDecoder, cartController.addShoe);
router.get("/getCart", tokenDecoder, cartController.getCartData);
// testing token decoder
router.get("/v3", tokenDecoder, cartController.getUserByToken);

module.exports = router;