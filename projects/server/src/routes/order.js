const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const userTokenDecoder = require("../middlewares/roleDecoder");
const { fileUploader } = require("../middlewares/multer");

router.post("/", userTokenDecoder.checkUser, orderController.addOrder);
router.get("/", userTokenDecoder.checkUser, orderController.getOrder);
router.post(
  "/paymentProof",
  fileUploader({ destinationFolder: "paymentProof" }).single("image"),
  orderController.paymentProof
);

module.exports = router;
