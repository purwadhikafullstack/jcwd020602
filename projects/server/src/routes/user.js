const express = require("express");
const router = express.Router();
const userController = require("../controllers").userController;
const tokenDecoder = require("../middlewares/tokenDecoder");
const {
  validateRegister,
  validateVerification,
} = require("../middlewares/validator");
const { fileUploader } = require("../middlewares/multer");
const roleDecoder = require("../middlewares/roleDecoder");

//REGISTER NEW USER ACCOUNT
router.post("/register", validateRegister, userController.register);

// VERIFICATION BY EMAIL
router.patch(
  "/verify",
  roleDecoder.checkUser,
  validateVerification,
  userController.verify
);

router.post("/login", userController.login);

router.get(
  "/userbytoken",
  userController.getByTokenV2,
  userController.getUserByToken
);

//token forgot password
// router.get("/generate-token/email", userController.generateTokenByEmail);

//forgot password
// router.patch(
//   "/forgot-password",
//   userController.tokenDecoder,
//   userController.forgotPassword
// );

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
  "/admin/:id",
  roleDecoder.checkSuper,
  fileUploader({
    destinationFolder: "avatar",
    fileType: "image",
  }).single("avatar"),
  userController.editAdminById
);
router.get(
  "/warehousebytoken",
  roleDecoder.checkAdmin,
  userController.getWarehouseCity
);
router.get("/", roleDecoder.checkSuper, userController.getAllUser);
router.get("/:id", roleDecoder.checkSuper, userController.getAdminById);
router.delete("/:id", roleDecoder.checkSuper, userController.deleteAdmin);

module.exports = router;
