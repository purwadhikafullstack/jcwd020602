const express = require("express");
const router = express.Router();
const stockMutationController =
  require("../controllers").stockMutationController;
const roleDecoder = require("../middlewares/roleDecoder");

router.post(
  "/",
  roleDecoder.checkAdmin,
  stockMutationController.addStockMutation
);
router.patch(
  "/confirm/:id",
  roleDecoder.checkAdmin,
  stockMutationController.confirmMutation
);
router.get(
  "/",
  roleDecoder.checkAdmin,
  stockMutationController.getStockMutation
);
router.get(
  "/:id",
  roleDecoder.checkAdmin,
  stockMutationController.getStockMutationById,
  stockMutationController.getStockMutationFromId
);
router.patch(
  "/:id",
  roleDecoder.checkAdmin,
  stockMutationController.editStockMutation
);
router.delete(
  "/:id",
  roleDecoder.checkAdmin,
  stockMutationController.deleteStockMutation
);

module.exports = router;
