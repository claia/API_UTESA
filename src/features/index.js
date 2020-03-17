const { Router } = require("express");
const features = Router();

/* import all features */
features.use("/auth", require("./auth"));
features.use("/documentsRequests", require("./documentsRequests"));
features.use("/notification", require("./notifications"));
features.use("/checkQualificationRequests", require("./qualificationRequests"));
features.use("/groups", require("./searchGroups"));
features.use("/newGroups", require("./newGroupRequests"));

features.use("*", (_, res) => res.sendStatus(404));

module.exports = features;
