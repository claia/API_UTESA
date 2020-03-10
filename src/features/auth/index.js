const { Router } = require("express");
const authRoutes = Router();

/* import all routes */
authRoutes.use(require("./routes/auth.routes"));

module.exports = authRoutes;
