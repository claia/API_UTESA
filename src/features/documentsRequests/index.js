const { Router } = require("express");
const documentsRequestsRoutes = Router();

/* import all routes */
documentsRequestsRoutes.use(require("./routes/documentsRequests.routes"));

module.exports = documentsRequestsRoutes;
