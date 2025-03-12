import express from "express";
import multer from "multer";
import { uploadFile, getImageById } from "../controller/fileController.js";

const router = express.Router();

const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpg, jpeg, png, gif, webp)."), false);
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } });

router.post(
    "/image",
    (req, res, next) => {
        upload.single("file")(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({ code: 400, message: "File size exceeds 2MB limit." });
                } else if (err instanceof Error) {
                    return res.status(400).json({ code: 400, message: err.message });
                }
            }
            next();
        });
    },
    uploadFile
);

router.get("/image/:id.:ext", getImageById);

export default router;
