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
<<<<<<< Updated upstream
router.get("/:id", categoryController.getCategoryById);
router.patch("/:id", categoryController.editCategory);
router.delete("/:id", categoryController.deleteCategory);
=======
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
>>>>>>> Stashed changes

module.exports = router;
