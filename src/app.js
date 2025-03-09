const express = require("express");
const userRoute = require("./route/userRoute.js");
const authRoute = require("./route/accessRoute.js");
const adminRoute = require("./route/adminRoute.js");
const fileRoute = require("./route/fileRoute.js");
const lenderRoute = require("./route/lenderRoute.js");
const parameterRoute = require("./route/parameterRoute.js");
const {errorHandler} = require("./middleware/errorHandler.js");
const {authenticateAndAuthorize} = require("./middleware/authMiddleware.js");

const app = express();
app.use(express.json());
app.use(authenticateAndAuthorize);
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/file", fileRoute);
app.use("/api/lender", lenderRoute);
app.use("/api/parameter", parameterRoute);
app.use(errorHandler);

module.exports = app;
