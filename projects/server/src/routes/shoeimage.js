const shoeimageController = require("../controllers").shoeimageController;
const router = require("express").Router();
const { fileUploader } = require("../middlewares/shoemulter");

router.post(
  "/",
  fileUploader({
    destinationFolder: "shoe",
    fileType: "image",
  }).array("shoe", 4),
  shoeimageController.addShoeimage
);

module.exports = router;
