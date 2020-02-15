const { Router } = require("express");
const router = Router();

/* Controllers */
const notificationController = require("../controllers/notification.controller");

router.post("/send", notificationController.sendNotificationBroadcast);

module.exports = router;
