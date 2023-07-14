const express = require("express");
const router = express.Router();
const addressController = require("../controllers").addressController;

router.post("/", addressController.insertAddress);
router.get("/", addressController.getAddressUser);
router.get("/detail", addressController.getAddressToEdit);
router.patch("/", addressController.updateAddress);
router.delete("/", addressController.deleteAddress);

module.exports = router;
