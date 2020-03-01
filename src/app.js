const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

/* Settings */
app.set("port", process.env.PORT || 8080);

/* Middlewares */
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* Routes */
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/documentsRequests", require("./routes/documentsRequests.routes"));
app.use("/api/notification", require("./routes/notification.routes"));
app.use("*", (req, res) => res.status(404).json({ error: "route not exist." }));
module.exports = app;
