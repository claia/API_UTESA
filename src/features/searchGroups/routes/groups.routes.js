const { param } = require("express-validator");
const { Router } = require("express");
// const { verifyToken } = require("../middlewares/tokenVerify");
const router = Router();

/* Controllers */
const groupsController = require("../controllers/groups.controllers.js");

router.get(
  "/:search",
  [param("search").notEmpty()],
  groupsController.getGroups
);

module.exports = router;
