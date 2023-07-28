const express = require("express");
const router = express.Router();
const stockMutationController =
  require("../controllers").stockMutationController;

router.post("/", stockMutationController.addStockMutation);
router.patch("/:id", stockMutationController.confirmMutation);

module.exports = router;
