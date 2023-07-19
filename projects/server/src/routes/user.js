const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;
const {
  validateRegister,
  validateVerification,
} = require("../middlewares/validator");

//REGISTER NEW USER ACCOUNT
router.post("/register", validateRegister, userController.register);

// VERIFICATION BY EMAIL
router.patch("/verify", validateVerification, userController.verify);

router.post("/login", userController.login);

router.get(
  "/userbytoken",
  userController.getByTokenV2,
  userController.getUserByToken
);

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
