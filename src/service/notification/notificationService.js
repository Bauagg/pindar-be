import {
    deleteNotificationForUser,
    getNotifications,
    markNotificationAsRead
} from "../../repository/notificationRepository.js";

export const fetchNotifications = async (userId, limit = 10, offset = 0, filterByRead) => {
    const { notifications, total } = await getNotifications(userId, limit, offset, filterByRead);

    return {
        notifications: notifications.map(notification => ({
            id: notification.id,
            title: notification.title,
            detail: notification.detail,
            link: notification.link,
            createdDate: notification.created_date,
            isRead: notification.is_read
        })),
        pagination: {
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Math.floor(offset / limit) + 1,
            size: limit
        }
    };
};

export const readNotification = async (userId, notificationId) => {
    await markNotificationAsRead(userId, notificationId);
};

export const removeNotificationForUser = async (userId, notificationId) => {
    await deleteNotificationForUser(userId, notificationId);
};