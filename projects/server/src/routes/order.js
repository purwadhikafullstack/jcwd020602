const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const userTokenDecoder = require("../middlewares/roleDecoder");
const { fileUploader } = require("../middlewares/multer");

router.post("/", userTokenDecoder.checkUser, orderController.addOrder);
router.get("/", userTokenDecoder.checkUser, orderController.getOrder);
router.get(
  "/admin",
  userTokenDecoder.checkAdmin,
  orderController.getOrderAdmin
);
router.patch(
  "/admin/:id",
  userTokenDecoder.checkAdmin,
  orderController.confirmPayment
);
router.post(
  "/paymentProof",
  fileUploader({ destinationFolder: "paymentProof" }).single("image"),
  orderController.paymentProof
);

module.exports = router;
