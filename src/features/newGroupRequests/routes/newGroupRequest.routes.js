const { param, check } = require("express-validator");
const { Router } = require("express");
// const { verifyToken } = require("../middlewares/tokenVerify");
const router = Router();

/* Controllers */
const newGroupsController = require("../controllers/newGroupRequest.controller");

router.get(
  "/days",
  [check("requestid").notEmpty()],
  newGroupsController.getAlDayFromRequest
);

router.get(
  "/joinedStudent",
  [check("requestid").notEmpty()],
  newGroupsController.getStudentsJoin
);

router.get(
  "/:pensumid/:studentid",
  [param("studentid").notEmpty(), param("pensumid").notEmpty()],
  newGroupsController.getSubjects
);

router.get(
  "/:studentid",
  [param("studentid").notEmpty()],
  newGroupsController.getAllGroupRequest
);

router.post(
  "/",
  [
    check("userid").notEmpty(),
    check("subjectid").notEmpty(),
    check("tanda").notEmpty(),
    check("diasid").notEmpty()
  ],
  newGroupsController.addGroupRequest
);

router.post(
  "/join",
  [check("requestid").notEmpty(), check("studentid").notEmpty()],
  newGroupsController.joinToRequest
);

router.delete(
  "/",
  [check("requestid").notEmpty()],
  newGroupsController.cancelRequest
);

router.delete(
  "/exit",
  [check("studentid").notEmpty()],
  newGroupsController.exitFromRequest
);

// router.post(
//   "/likes",
//   [
//     check("groupid").notEmpty(),
//     check("like").notEmpty(),
//     check("studentid").notEmpty()
//   ],
//   groupsController.updateLike
// );

module.exports = router;
