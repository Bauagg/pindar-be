import {
    countAnnouncements,
    createAnnouncement, deleteAnnouncementById, getActiveAnnouncements,
    getAnnouncementById, getPaginatedAnnouncements,
    updateAnnouncementById
} from "../../repository/announcementRepository.js";
import {getParameterByKey} from "../../repository/parameterRepository.js";


const validStatuses = ["active", "inactive"];

export const insertAnnouncement = async (data) => {
    const { status, url, imageId, order } = data;

    if (!status || !validStatuses.includes(status.toLowerCase())) {
        throw { status: 400, message: "Invalid status. Allowed values: Active, Inactive." };
    }

    if (!Number.isInteger(order) || order < 1) {
        throw { status: 400, message: "Invalid order. Order must be a positive integer." };
    }

    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return await createAnnouncement({ status: normalizedStatus, url, imageId, order });
};

export const fetchAnnouncementById = async (id) => {
    const announcement = await getAnnouncementById(id);
    if (!announcement) throw { status: 404, message: "Announcement not found." };
    return formatAnnouncementResponse(announcement);
};

export const fetchAnnouncements = async (limit = 10, offset = 0, search = "") => {
    const announcements = await getPaginatedAnnouncements(limit, offset, search);
    const total = await countAnnouncements(search); // Include search in the count query

    return {
        announcements: announcements.map(formatAnnouncementResponse),
        pagination: {
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Math.floor(offset / limit) + 1,
            size: limit
        }
    };
};


export const modifyAnnouncement = async (id, data) => {
    const { status, url, imageId, order } = data;

    if (!status || !validStatuses.includes(status.toLowerCase())) {
        throw { status: 400, message: "Invalid status. Allowed values: Active, Inactive." };
    }

    if (!Number.isInteger(order) || order < 1) {
        throw { status: 400, message: "Invalid order. Order must be a positive integer." };
    }

    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    return formatAnnouncementResponse(await updateAnnouncementById(id, { status: normalizedStatus, url, imageId, order }));
};

export const removeAnnouncement = async (id) => {
    await deleteAnnouncementById(id);
};

export const fetchActiveAnnouncements = async () => {
    const announcements = await getActiveAnnouncements();
    return announcements.map(formatAnnouncementResponse);
};

export const fetchParameterByKey = async (paramKey) => {
    const parameter = await getParameterByKey(paramKey);
    if (!parameter) {
        throw { status: 404, message: "Parameter not found or not fetchable." };
    }

    return parameter;
};


const formatAnnouncementResponse = (announcement) => ({
    id: announcement.id,
    status: announcement.status,
    url: announcement.url,
    order: announcement.order,
    imageLink: announcement.image_link
});