const shoeController = require("../controllers").shoeController;
const router = require("express").Router();
const { fileUploader } = require("../middlewares/shoemulter");

router.get("/", shoeController.getAllShoe);

router.get("/:name", shoeController.getShoeByName);

router.post(
  "/",
  fileUploader({
    destinationFolder: "shoe",
    fileType: "image",
  }).array("shoe", 4),
  shoeController.addShoe
);

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
