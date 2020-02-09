var express = require("express");
var router = express.Router();

/* importing controllers. */
const indexController = require("../controllers/index.controllers");
const notificationController = require("../controllers/notification.controller");

router.get("/", function(req, res, next) {
  res.redirect("/send");
});

router.get("/send", notificationController.index);
router.post("/api/send", notificationController.send);

module.exports = router;
