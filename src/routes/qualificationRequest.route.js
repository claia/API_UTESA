const { param, check } = require("express-validator");
const { Router } = require("express");
// const { verifyToken } = require("../middlewares/tokenVerify");
const router = Router();

/* Controllers */
const checkQualificationRequestController = require("../controllers/qualificationRequests.controllers");

router.get(
  "/documents",
  [check("userid").notEmpty()],
  checkQualificationRequestController.getRequest
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
