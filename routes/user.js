const express = require("express");
const authController = require("./../controllers/auth");
const userController = require("../controllers/User");
const StaticData = require("../utils/StaticData");

const router = express.Router();

router.route("/signup").post(authController.signup);

router.route("/login").post(authController.login);

// router.param("id", userController.checkID);

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(
    authController.protect,
    authController.restrictTo(StaticData.AUTH.Role.admin),
    userController.updateUserById
  )
  .delete(
    authController.protect,
    authController.restrictTo(StaticData.AUTH.Role.admin),
    userController.deleteUserById
  );
//.get(userController.getUser)

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo(StaticData.AUTH.Role.admin),
    userController.getUsers
  )
  .post(
    authController.protect,
    authController.restrictTo(StaticData.AUTH.Role.admin),
    userController.addUser
  )
  .delete(
    authController.protect,
    authController.restrictTo(StaticData.AUTH.Role.admin),
    userController.deleteMultipleUserById //param id=1,id=2,...
  );

router.route("/byname/:username").post(userController.getUserByUserName);

module.exports = router;
