const { Router } = require("express");
const router = Router();

/* Controllers */
const usersController = require("../controllers/users.controller");

router.get("/", usersController.index);

module.exports = router;
