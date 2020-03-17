const { Router } = require("express");
const newGroupRequestRoutes = Router();

/* import all routes */
newGroupRequestRoutes.use(require("./routes/newGroupRequest.routes"));

module.exports = newGroupRequestRoutes;
