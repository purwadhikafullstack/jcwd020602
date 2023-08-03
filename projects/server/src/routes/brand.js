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
<<<<<<< Updated upstream
=======
router.delete("/:id", roleDecoder.checkSuper, brandController.deleteBrand);
>>>>>>> Stashed changes
module.exports = router;
