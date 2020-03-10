const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

/* Controllers */
const notificationController = require("../controllers/notification.controller");

router.post(
  "/send",
  [check("title").notEmpty(), check("body").notEmpty()],
  notificationController.sendNotificationBroadcast
);

module.exports = router;
