import express from "express";
import userRoute from "./route/userRoute.js";
import authRoute from "./route/accessRoute.js";
import adminRoute from "./route/adminRoute.js";
import fileRoute from "./route/fileRoute.js";
import lenderRoute from "./route/lenderRoute.js";
import parameterRoute from "./route/parameterRoute.js";
import faqRoute from "./route/faqRoute.js";
import creditCardRoute from "./route/creditCardRoute.js";
import contentRoute from "./route/contentRoute.js";
import announcementRoute from "./route/announcementRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authenticateAndAuthorize } from "./middleware/authMiddleware.js";
import cors from "cors";

const app = express();
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://admin.pindar.id",
    "https://admin.pindar.id",
    "http://pindar.id",
    "https://pindar.id"
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS policy: Origin not allowed"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: "*",
        credentials: true
    })
);

app.use(express.json());
app.use(authenticateAndAuthorize);

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/file", fileRoute);
app.use("/api/lender", lenderRoute);
app.use("/api/parameter", parameterRoute);
app.use("/api/faq", faqRoute);
app.use("/api/credit-card", creditCardRoute);
app.use("/api/content", contentRoute);
app.use("/api/announcement", announcementRoute);

app.use(errorHandler);

export default app;