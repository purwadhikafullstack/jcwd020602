const express = require("express");
const router = express.Router();
const checkOutController = require("../controllers/checkOut");
const userTokenDecoder = require("../middlewares/roleDecoder");
const findWarehouse = require("../middlewares/findWarehouse");

// MENAMBAHKAN PRODUCT TO CART
router.post("/", userTokenDecoder.checkUser, checkOutController.insertAddress);
router.get("/", userTokenDecoder.checkUser, checkOutController.getAddress);
router.patch("/", userTokenDecoder.checkUser, checkOutController.chooseAddress);
// finding closest warehous to address
// router.get("/closestWarehouse", userTokenDecoder.checkUser, findWarehouse);

router.post(
  "/shipping",
  userTokenDecoder.checkUser,
  findWarehouse,
  checkOutController.ongkir
);

module.exports = router;
