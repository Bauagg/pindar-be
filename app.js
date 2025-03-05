const express = require("express");
const userRoute = require("./route/userRoute.js");
const accessRoute = require("./route/accessRoute.js");
const {errorHandler} = require("./middleware/errorHandler.js");

const app = express();
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/access", accessRoute);
app.use(errorHandler);

module.exports = app;
