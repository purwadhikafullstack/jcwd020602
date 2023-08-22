const express = require("express");
const router = express.Router();
const cartController = require("../controllers").cartController;
const userTokenDecoder = require("../middlewares/roleDecoder");

// MENAMBAHKAN PRODUCT TO CART

router.post("/", userTokenDecoder.checkUser, cartController.addShoe);
router.get("/getCart", userTokenDecoder.checkUser, cartController.getCartData);
router.patch("/", userTokenDecoder.checkUser, cartController.updateCart);
router.delete(
  "/:id",
  userTokenDecoder.checkUser,
  cartController.deleteCartData
);

module.exports = router;
