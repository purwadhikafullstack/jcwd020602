const brandController = require("../controllers").brandController;
const router = require("express").Router();
const { fileUploader } = require("../middlewares/multer");

router.post(
  "/",
  fileUploader({
    destinationFolder: "brand",
    fileType: "image",
  }).array("brand", 2),
  brandController.addBrand
);
router.get("/", brandController.getAll);
module.exports = router;
