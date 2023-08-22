const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const userTokenDecoder = require("../middlewares/roleDecoder");
const { fileUploader } = require("../middlewares/multer");
const findWarehouse = require("../middlewares/findWarehouse");

router.post(
  "/",
  userTokenDecoder.checkUser,
  findWarehouse,
  orderController.addOrder
);
router.get(
  "/",
  userTokenDecoder.checkUser,
  findWarehouse,
  orderController.getOrder
);
router.patch(
  "/cancelOrderUser/:id",
  orderController.getOrderById,
  orderController.cancelPaymentUser
);
router.patch(
  "/paymentProof",
  userTokenDecoder.checkUser,
  fileUploader({ destinationFolder: "paymentProof" }).single("payment_proof"),
  orderController.paymentProof
);
router.patch(
  "/rejectPayment/:id",
  orderController.getOrderById,
  orderController.rejectPaymentProof
);
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
module.exports = router;
