const shoeController = require("../controllers").shoeController;
const router = require("express").Router();
const { fileUploader } = require("../middlewares/shoemulter");
const roleDecoder = require("../middlewares/roleDecoder");

router.post(
  "/",
  roleDecoder.checkSuper,
  fileUploader({
    destinationFolder: "shoe",
    fileType: "image",
  }).array("shoe", 4),
  shoeController.addShoe
);
router.get("/", shoeController.getAll);
router.get("/:id", shoeController.getById);
<<<<<<< Updated upstream
router.get("/category/:category_id", shoeController.getByCategory);
router.get("/subcategory/:subcategory_id", shoeController.getBySubcategory);
router.get("/brand/:brand_id", shoeController.getByBrand);
=======
router.patch(
  "/:id",
  roleDecoder.checkSuper,
  fileUploader({
    destinationFolder: "shoe",
    fileType: "image",
  }).array("shoe", 4),
  shoeController.editShoe
);

router.delete("/:id", roleDecoder.checkSuper, shoeController.deleteShoe);
>>>>>>> Stashed changes

module.exports = router;
