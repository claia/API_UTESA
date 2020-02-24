const { check } = require("express-validator");
const { Router } = require("express");
const router = Router();

/* Controllers */
const authController = require("../controllers/auth.controller");

router.post(
  "/",
  [
    check("studentid").notEmpty(),
    check("enclosuresid").notEmpty(),
    check("password").notEmpty()
  ],
  authController.login
);

router.post(
  "/setDeviceId",
  [check("userid").notEmpty(), check("deviceid").notEmpty()],
  authController.insertDeviceId
);

module.exports = router;
