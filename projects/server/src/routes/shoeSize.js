const shoeSizeController = require("../controllers").shoeSizeController;
const router = require("express").Router();

router.post("/", shoeSizeController.addShoeSize);

router.get("/", shoeSizeController.getAll);

router.delete("/", shoeSizeController.deleteShoeSize);
module.exports = router;
