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

router.post("/sub", categoryController.addSubcategory);
router.get("/sub", categoryController.getAllSubcategory);
module.exports = router;
