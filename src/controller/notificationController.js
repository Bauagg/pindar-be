import {
    fetchNotifications,
    readNotification,
    removeNotificationForUser
} from "../service/notification/notificationService.js";

export const getAllNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;
        const filterByRead = req.query.read; // Accepts "read" or "unread"

        const data = await fetchNotifications(userId, limit, offset, filterByRead);

        res.status(200).json({
            code: 200,
            message: "Notifications retrieved successfully.",
            data
        });
    } catch (error) {
        next(error);
    }
};

export const markAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;
        await readNotification(userId, notificationId);
        res.status(200).json({
            code: 200,
            message: "Notification marked as read."
        });
    } catch (error) {
        next(error);
    }
};

export const deleteNotificationForUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;
        await removeNotificationForUser(userId, notificationId);
        res.status(200).json({
            code: 200,
            message: "Notification deleted for user."
        });
    } catch (error) {
        next(error);
    }
};