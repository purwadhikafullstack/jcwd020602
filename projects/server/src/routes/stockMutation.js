const express = require("express");
const router = express.Router();
const stockMutationController =
  require("../controllers").stockMutationController;
const roleDecoder = require("../middlewares/roleDecoder");
const { validateStockMutation } = require("../middlewares/validator");

router.post(
  "/",
  roleDecoder.checkAdmin,
  validateStockMutation,
  stockMutationController.addStockMutation
);
router.patch(
  "/confirm/:id",
  roleDecoder.checkAdmin,
  stockMutationController.getStockMutationById,
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
  stockMutationController.getStockMutationById,
  validateStockMutation,
  stockMutationController.editStockMutation
);
router.delete(
  "/:id",
  roleDecoder.checkAdmin,
  stockMutationController.getStockMutationById,
  stockMutationController.deleteStockMutation
);

module.exports = router;
