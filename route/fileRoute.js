const express = require("express");
const {adminSignIn, addUser, updateUser, deleteUser, listUsers, getUserDetail} = require("../controller/adminController");
const multer = require("multer");
const {uploadFile} = require("../controller/fileController.js");
const router = express.Router();

const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpg, jpeg, png, gif, webp)."), false);
    }
};

const upload = multer({ storage, fileFilter });

router.post("/image", upload.single("file"), uploadFile);

module.exports = router;