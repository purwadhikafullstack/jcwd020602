const categoryController = require("../controllers").categoryController;
const router = require("express").Router();
const { fileUploader } = require("../middlewares/multer");
const roleDecoder = require("../middlewares/roleDecoder");

router.post(
  "/",
  roleDecoder.checkSuper,
  fileUploader({
    destinationFolder: "category",
    fileType: "image",
  }).single("category"),
  categoryController.addCategory
);

router.get("/", categoryController.getAllCategory);
router.get("/selectCategory", categoryController.getAllCategorySelect);
router.get("/selectSubcategory", categoryController.getAllSubSelect);

router.get("/:id", roleDecoder.checkSuper, categoryController.getCategoryById);

router.patch(
  "/:id",
  roleDecoder.checkSuper,
  fileUploader({
    destinationFolder: "category",
    fileType: "image",
  }).single("category"),
  categoryController.editCategory
);

router.delete(
  "/:id",
  roleDecoder.checkSuper,
  categoryController.deleteCategory
);

module.exports = router;
