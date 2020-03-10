const { Router } = require("express");
const notificationRoutes = Router();

/* import all routes */
notificationRoutes.use(require("./routes/notification.routes"));

module.exports = notificationRoutes;
