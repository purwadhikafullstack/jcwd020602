const shoeController = require("../controllers").shoeController;
const router = require("express").Router();

router.post("/", shoeController.addShoe);
router.get("/", shoeController.getAll);
router.get("/:id", shoeController.getById);
router.get("/category/:category_id", shoeController.getByCategory);
router.get("/subcategory/:subcategory_id", shoeController.getBySubcategory);

module.exports = router;
