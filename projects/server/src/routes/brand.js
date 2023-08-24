const brandController = require("../controllers").brandController;
const router = require("express").Router();
const { fileUploader } = require("../middlewares/multer");
const roleDecoder = require("../middlewares/roleDecoder");

router.post(
  "/",
  roleDecoder.checkSuper,
  fileUploader({
    destinationFolder: "brand",
    fileType: "image",
  }).array("brand", 2),
  brandController.addBrand
);

router.get("/", brandController.getAll);
router.get("/select", brandController.getAllSelect);

router.delete("/:id", roleDecoder.checkSuper, brandController.deleteBrand);

module.exports = router;
