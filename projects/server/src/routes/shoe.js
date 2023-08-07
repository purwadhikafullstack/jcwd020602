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
router.get("/", shoeController.getAllShoe);
router.get("/:name", shoeController.getShoeByName);
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

module.exports = router;
