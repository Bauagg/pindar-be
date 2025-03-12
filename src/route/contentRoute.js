import express from "express";
import {
    createContent,
    getContentById,
    updateContent,
    deleteContent,
    getContentList
} from "../controller/contentController.js";

import {
    createContentCategory,
    getContentCategories,
    bulkCreateContentCategories,
    getContentCategoryById,
    updateContentCategory,
    deleteContentCategory
} from "../controller/contentCategoryController.js";

import {
    createComment,
    getCommentsByContentId,
    getCommentList,
    getCommentReplies,
    deleteComment,
    likeOrUnlikeComment
} from "../controller/commentController.js";

const router = express.Router();

router.post("/create", createContent);
router.get("/list", getContentList);
router.get("/detail/:id", getContentById);
router.put("/update/:id", updateContent);
router.delete("/delete/:id", deleteContent);

router.post("/content-category", createContentCategory);
router.get("/content-category", getContentCategories);
router.post("/content-category/bulk", bulkCreateContentCategories);
router.get("/content-category/:id", getContentCategoryById);
router.put("/content-category/:id", updateContentCategory);
router.delete("/content-category/:id", deleteContentCategory);

router.post("/comment/:contentId", createComment);
router.get("/comment/list/:contentId", getCommentList);
router.get("/comment/replies/:commentId", getCommentReplies);
router.delete("/comment/:id", deleteComment);

router.post("/comment/like/:commentId", likeOrUnlikeComment);

export default router;
