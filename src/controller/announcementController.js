import {
    fetchActiveAnnouncements,
    fetchAnnouncementById,
    fetchAnnouncements,
    insertAnnouncement, modifyAnnouncement, removeAnnouncement
} from "../service/announcement/announcementService.js";


export const createAnnouncement = async (req, res, next) => {
    try {
        const announcement = await insertAnnouncement(req.body);
        res.status(201).json({
            code: 201,
            message: "Announcement created successfully.",
            data: announcement
        });
    } catch (error) {
        next(error);
    }
};

export const getAnnouncementById = async (req, res, next) => {
    try {
        const announcement = await fetchAnnouncementById(req.params.id);
        res.status(200).json({
            code: 200,
            message: "Announcement retrieved successfully.",
            data: announcement
        });
    } catch (error) {
        next(error);
    }
};

export const getAnnouncements = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = parseInt(req.query.offset, 10) || 0;
        const search = req.query.search || ""; // Get search term from query parameters

        const announcements = await fetchAnnouncements(limit, offset, search);
        res.status(200).json({
            code: 200,
            message: "Announcements retrieved successfully.",
            data: announcements
        });
    } catch (error) {
        next(error);
    }
};


export const updateAnnouncement = async (req, res, next) => {
    try {
        const updatedAnnouncement = await modifyAnnouncement(req.params.id, req.body);
        res.status(200).json({
            code: 200,
            message: "Announcement updated successfully.",
            data: updatedAnnouncement
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAnnouncement = async (req, res, next) => {
    try {
        await removeAnnouncement(req.params.id);
        res.status(200).json({
            code: 200,
            message: "Announcement deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};

export const getActiveBanners = async (req, res, next) => {
    try {
        const banners = await fetchActiveAnnouncements();
        res.status(200).json({
            code: 200,
            message: "Active banners retrieved successfully.",
            data: banners
        });
    } catch (error) {
        next(error);
    }
};