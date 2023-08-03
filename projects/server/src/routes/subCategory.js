const categoryController = require("../controllers").categoryController;
const router = require("express").Router();
const roleDecoder = require("../middlewares/roleDecoder");

router.post("/", roleDecoder.checkSuper, categoryController.addSubcategory);
router.get("/", roleDecoder.checkAdmin, categoryController.getAllSub);
router.get(
  "/:id",
  roleDecoder.checkSuper,
  categoryController.getSubcategoryById
);
router.patch("/:id", roleDecoder.checkSuper, categoryController.editSubategory);
router.delete(
  "/:id",
  roleDecoder.checkSuper,
  categoryController.deleteSubcategory
);

module.exports = router;
