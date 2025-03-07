import {saveFileService} from "../service/file/saveFileService.js";
import {getFileById} from "../service/file/getImageService.js";


export const uploadFile = async (req, res, next) => {
    try {
        const { file } = req;
        const { moduleName } = req.body;
        const userId = req.user?.id;
        const isUsed = false;
        const extension = `.${file.mimetype.split("/")[1]}`

        if (!file) {
            return res.status(400).json({ code: 400, message: "No file uploaded." });
        }

        if (!moduleName) {
            return res.status(400).json({ code: 400, message: "Module name is required." });
        }

        if (!userId) {
            return res.status(401).json({ code: 401, message: "Unauthorized. User ID not found." });
        }

        // Call service to save the file in the database
        const fileId = await saveFileService({
            fileName: file.originalname.split(".")[0],
            fileExtension: extension,
            fileSize: file.size,
            fileData: file.buffer,
            moduleName,
            isUsed,
            uploadedBy: userId, // ✅ Ensure user ID is passed
        });

        res.status(201).json({
            code: 201,
            message: "File uploaded successfully.",
            data: { fileId, extension },
        });
    } catch (error) {
        next(error);
    }
};

const mimeTypes = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "webp": "image/webp",
};

export const getImageById = async (req, res, next) => {
    try {
        const { id, ext } = req.params;
        const file = await getFileById(id);

        if (!file) {
            return res.status(404).json({ code: 404, message: "Image not found." });
        }

        // Ensure requested extension matches the stored file extension
        const storedExtension = file.file_extension.replace(".", "").toLowerCase();
        if (storedExtension !== ext.toLowerCase()) {
            return res.status(400).json({ code: 400, message: "Invalid file extension." });
        }

        // Determine MIME type
        const contentType = mimeTypes[storedExtension];
        if (!contentType) {
            return res.status(400).json({ code: 400, message: "Unsupported image format." });
        }

        res.setHeader("Content-Type", contentType);
        res.send(file.file_data); // ✅ Display image in browser
    } catch (error) {
        next(error);
    }
};
