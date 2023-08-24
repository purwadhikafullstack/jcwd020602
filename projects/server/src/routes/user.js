const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;
const {
  validateRegister,
  validateVerification,
  validateLogin,
  validateEditProfile,
  validateForgotPass,
  validateEditPassword,
} = require("../middlewares/validator");
const { fileUploader } = require("../middlewares/multer");
const roleDecoder = require("../middlewares/roleDecoder");

//REGISTER NEW USER ACCOUNT
router.post("/register", validateRegister, userController.register);

// VERIFICATION BY EMAIL
router.patch("/verify", validateVerification, userController.verify);

//login
router.post("/login", validateLogin, userController.login);

router.get(
  "/userbytoken",
  userController.tokenDecoder,
  userController.getUserByToken
);

//token forgot password
router.get("/generate-token/email", userController.generateTokenByEmail);

//forgot password
router.patch(
  "/forgot-password",
  validateForgotPass,
  userController.tokenDecoder,
  userController.forgotPassword
);

//edit profile
router.patch(
  "/profile",
  fileUploader({
    destinationFolder: "avatar",
    fileType: "image",
  }).single("avatar"),
  validateEditProfile,
  userController.editProfile
);

router.patch("/password", validateEditPassword, userController.editPassword);

// ------------- admin
router.post(
  "/admin",
  roleDecoder.checkSuper,
  fileUploader({
    destinationFolder: "avatar",
    fileType: "image",
  }).single("avatar"),
  userController.addAdmin
);
router.patch(
  "/editAdmin",
  roleDecoder.checkSuper,
  fileUploader({
    destinationFolder: "avatar",
    fileType: "image",
  }).single("avatar"),
  userController.editProfile
);
router.get("/", roleDecoder.checkSuper, userController.getAllUser);
router.get("/:id", roleDecoder.checkSuper, userController.getAdminById);
router.delete("/:id", roleDecoder.checkSuper, userController.deleteAdmin);

module.exports = router;
