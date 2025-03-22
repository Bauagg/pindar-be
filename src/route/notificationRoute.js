import { Router } from "express";
import {deleteNotificationForUser, getAllNotifications, markAsRead} from "../controller/notificationController.js";

const router = Router();

router.get("/list", getAllNotifications);
router.post("/read/:notificationId", markAsRead);
router.delete("/delete/:notificationId", deleteNotificationForUser);

export default router;
