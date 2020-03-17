const { param, check } = require("express-validator");
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

router.get(
  "/comments/:groupid",
  [param("groupid").notEmpty()],
  groupsController.getGroupComments
);

router.post(
  "/comments",
  [
    check("groupid").notEmpty(),
    check("comment").notEmpty(),
    check("studentid").notEmpty()
  ],
  groupsController.addComment
);

router.post(
  "/likes",
  [
    check("groupid").notEmpty(),
    check("like").notEmpty(),
    check("studentid").notEmpty()
  ],
  groupsController.updateLike
);

module.exports = router;
