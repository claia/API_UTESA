const { Router } = require("express");
const qualificationRequestsRoutes = Router();

/* import all routes */
qualificationRequestsRoutes.use(
  require("./routes/qualificationRequest.routes")
);

module.exports = qualificationRequestsRoutes;
