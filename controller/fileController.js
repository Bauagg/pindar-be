import {saveFileService} from "../service/file/saveFileService.js";


export const uploadFile = async (req, res, next) => {
    try {
        const { file } = req;
        const { moduleName } = req.body;
        const userId = req.user?.id;
        const isUsed = false;

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
            fileExtension: `.${file.mimetype.split("/")[1]}`,
            fileSize: file.size,
            fileData: file.buffer,
            moduleName,
            isUsed,
            uploadedBy: userId, // ✅ Ensure user ID is passed
        });

        res.status(201).json({
            code: 201,
            message: "File uploaded successfully.",
            data: { fileId },
        });
    } catch (error) {
        next(error);
    }
};