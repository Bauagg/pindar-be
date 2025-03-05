const express = require("express");
const userRoute = require("./route/userRoute.js");
const {errorHandler} = require("./middleware/errorHandler.js");

const app = express();
app.use(express.json());
app.use("/api/user", userRoute);
app.use(errorHandler);

module.exports = app;
