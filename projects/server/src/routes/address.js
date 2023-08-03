const express = require("express");
const router = express.Router();
const addressController = require("../controllers").addressController;
const roleDecoder = require("../middlewares/roleDecoder");

router.post("/", roleDecoder.checkUser, addressController.insertAddress);
router.get("/", roleDecoder.checkUser, addressController.getAddressUser);
router.get(
  "/detail",
  roleDecoder.checkUser,
  addressController.getAddressToEdit
);
router.patch("/", roleDecoder.checkUser, addressController.updateAddress);
router.delete("/", roleDecoder.checkUser, addressController.deleteAddress);

module.exports = router;
