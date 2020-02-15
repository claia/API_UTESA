const { Router } = require("express");
const router = Router();

/* Controllers */
const authController = require("../controllers/auth.controller");

router.get("/", authController.login);

module.exports = router;
