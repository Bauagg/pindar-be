import { Router } from "express";
import {
    createAnnouncement, deleteAnnouncement, getActiveBanners,
    getAnnouncementById,
    getAnnouncements,
    updateAnnouncement
} from "../controller/announcementController.js";


const router = Router();

router.get("/active", getActiveBanners);
router.post("/", createAnnouncement);
router.get("/", getAnnouncements);
router.get("/:id", getAnnouncementById);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;
