const { param, check } = require("express-validator");
const { Router } = require("express");
// const { verifyToken } = require("../middlewares/tokenVerify");
const router = Router();

/* Controllers */
const groupsController = require("../controllers/groups.controllers.js");

router.get("/groups", groupsController.getGroups);
router.get(
  "/groups/:subjectId",
  [param("subjectId").notEmpty()],
  groupsController.getGroups
);
module.exports = router;
