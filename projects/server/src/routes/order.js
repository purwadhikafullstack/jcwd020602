const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const salesReportController = require("../controllers/salesReport");
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
  "/doneOrder/:id",
  orderController.getOrderById,
  orderController.doneOrderUser
);
router.patch(
  "/paymentProof/:id",
  userTokenDecoder.checkUser,
  fileUploader({ destinationFolder: "paymentProof" }).single("payment_proof"),
  orderController.getOrderById,
  orderController.paymentProof
);
router.get(
  "/admin",
  userTokenDecoder.checkAdmin,
  orderController.getOrderAdmin
);
router.get(
  "/salesReport",
  userTokenDecoder.checkAdmin,
  salesReportController.getSalesReport
);
router.patch(
  "/admin/:id",
  userTokenDecoder.checkAdmin,
  orderController.getOrderById,
  orderController.confirmPayment
);
router.get(
  "/admin/:id",
  orderController.getOrderById,
  orderController.getOrderId
);
router.post(
  "/paymentProof",
  fileUploader({ destinationFolder: "paymentProof" }).single("image"),
  orderController.paymentProof
);

module.exports = router;
