const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;
const {
  validateRegister,
  validateVerification,
} = require("../middlewares/validator");
const { fileUploader } = require("../middlewares/multer");

//REGISTER NEW USER ACCOUNT
router.post("/register", validateRegister, userController.register);

// VERIFICATION BY EMAIL
router.patch("/verify", validateVerification, userController.verify);

//login
router.post("/login", userController.login);

router.get(
  "/userbytoken",
  userController.tokenDecoder,
  userController.getUserByToken
);

router.get(
  "/warehousebytoken",
  userController.tokenDecoder,
  userController.getWarehouseCity
);

//token forgot password
router.get("/generate-token/email", userController.generateTokenByEmail);

//forgot password
router.patch(
  "/forgot-password",
  userController.tokenDecoder,
  userController.forgotPassword
);

// ------------- admin
router.post(
  "/admin",
  fileUploader({
    destinationFolder: "avatar",
    fileType: "image",
  }).single("avatar"),
  userController.addAdmin
);
router.patch(
  "/admin/:id",
  fileUploader({
    destinationFolder: "avatar",
    fileType: "image",
  }).single("avatar"),
  userController.editAdminById
);

router.get("/", userController.getAllUser);
router.get("/:id", userController.getAdminById);
router.delete("/:id", userController.deleteAdmin);

module.exports = router;
