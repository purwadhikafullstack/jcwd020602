const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;
const tokenDecoder = require("../middlewares/tokenDecoder");
const {
  validateRegister,
  validateVerification,
} = require("../middlewares/validator");
const { fileUploader } = require("../middlewares/multer");

//REGISTER NEW USER ACCOUNT
router.post("/register", validateRegister, userController.register);

// VERIFICATION BY EMAIL
router.patch("/verify", validateVerification, userController.verify);

router.post("/login", userController.login);

router.get("/userbytoken", tokenDecoder, userController.getUserByToken);

router.post(
  "/admin",
  fileUploader({
    destinationFolder: "avatar",
    fileType: "image",
  }).single("avatar"),
  userController.addAdmin
);

router.get("/", userController.getAllUser);

module.exports = router;
