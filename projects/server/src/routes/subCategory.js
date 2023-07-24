const categoryController = require("../controllers").categoryController;
const router = require("express").Router();

router.post("/", categoryController.addSubcategory);
router.get("/", categoryController.getAllSub);
router.get("/:id", categoryController.getSubcategoryById);
router.patch("/:id", categoryController.editSubategory);
router.delete("/:id", categoryController.deleteSubcategory);

module.exports = router;
