const categoryController = require("../controllers").categoryController;
const router = require("express").Router();
const { fileUploader } = require("../middlewares/multer");

router.post(
  "/",
  fileUploader({
    destinationFolder: "category",
    fileType: "image",
  }).single("category"),
  categoryController.addCategory
);
router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.getCategoryById);
router.patch("/:id", categoryController.editCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
