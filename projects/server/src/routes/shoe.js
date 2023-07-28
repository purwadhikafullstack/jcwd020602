const shoeController = require("../controllers").shoeController;
const router = require("express").Router();
const { fileUploader } = require("../middlewares/shoemulter");

router.post(
  "/",
  fileUploader({
    destinationFolder: "shoe",
    fileType: "image",
  }).array("shoe", 4),
  shoeController.addShoe
);
router.get("/", shoeController.getAll);
router.get("/:id", shoeController.getById);
router.get("/category/:category_id", shoeController.getByCategory);
router.get("/subcategory/:subcategory_id", shoeController.getBySubcategory);
router.get("/brand/:brand_id", shoeController.getByBrand);
router.patch(
  "/:id",
  fileUploader({
    destinationFolder: "shoe",
    fileType: "image",
  }).array("shoe", 4),
  shoeController.editShoe
);

router.delete("/:id", shoeController.deleteShoe);

module.exports = router;
