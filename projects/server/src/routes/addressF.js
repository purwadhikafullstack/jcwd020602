const express = require("express");
const router = express.Router();
const addressController = require("../controllers").addressFController;
const roleDecoder = require("../middlewares/roleDecoder");

router.post("/", roleDecoder.checkUser, addressController.addAddress);
router.get("/", roleDecoder.checkUser, addressController.getAddressUser);
router.delete("/", addressController.deleteAddress);
router.patch("/edit", addressController.editAddress);
module.exports = router;
