const { check } = require("express-validator");
const { Router } = require("express");
// const { verifyToken } = require("../middlewares/tokenVerify");
const router = Router();

/* Controllers */
const checkQualificationRequestController = require("../controllers/qualificationRequests.controllers");

router.get(
  "/requests",
  [check("userid").notEmpty(), check("status").notEmpty()],
  checkQualificationRequestController.getRequest
);

router.put(
  "/",
  [check("requestid").notEmpty()],
  checkQualificationRequestController.updateRequestStatus
);

router.get(
  "/groups/:studentid",
  [check("studentid").notEmpty()],
  checkQualificationRequestController.getGroupByStudentId
);

router.delete(
  "/",
  [check("requestid").notEmpty()],
  checkQualificationRequestController.cancelRequest
);

router.post(
  "/",
  [
    check("userid").notEmpty(),
    check("groupid").notEmpty(),
    check("razon").notEmpty()
  ],
  checkQualificationRequestController.createRequest
);

module.exports = router;
