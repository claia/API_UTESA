const { Router } = require("express");
const searchGroups = Router();

/* import all routes */
searchGroups.use(require("./routes/groups.routes"));

module.exports = searchGroups;
