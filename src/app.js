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
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/notification", require("./routes/notification.routes"));

module.exports = app;
