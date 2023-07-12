const express = require("express");
const router = express.Router();
const addressController = require("../controllers").addressController;

router.post("/:user_id", addressController.insertAddress);
router.get("/:user_id", addressController.getAddressUser);
router.get("/detail/:user_id", addressController.getAddressToEdit);
router.patch("/:user_id", addressController.updateAddress);
router.delete("/:user_id", addressController.deleteAddress);

module.exports = router;
