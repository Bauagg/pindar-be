const express = require("express");
const {createContent, getContentById, updateContent, deleteContent} = require("../controller/contentController.js");
const {getContentList} = require("../controller/contentController.js");
const {createContentCategory, getContentCategories, bulkCreateContentCategories, getContentCategoryById,
    updateContentCategory, deleteContentCategory
} = require("../controller/contentCategoryController.js");
const {createComment, getCommentsByContentId, getCommentList, getCommentReplies, deleteComment} = require("../controller/commentController.js");
const {likeOrUnlikeComment} = require("../controller/commentController.js");
const router = express.Router();

router.post('/create', createContent);
router.get('/list', getContentList);
router.get('/detail/:id', getContentById);
router.put('/update/:id', updateContent);
router.delete('/delete/:id', deleteContent);

router.post('/content-category', createContentCategory);
router.get('/content-category', getContentCategories);
router.post('/content-category/bulk', bulkCreateContentCategories);
router.get('/content-category/:id', getContentCategoryById);
router.put('/content-category/:id', updateContentCategory);
router.delete('/content-category/:id', deleteContentCategory);

router.post('/comment/:contentId', createComment);
// router.get('/comment/:contentId', getCommentsByContentId);
router.get('/comment/list/:contentId', getCommentList);
router.get('/comment/replies/:commentId', getCommentReplies);
router.delete('/comment/:id', deleteComment);

router.post('/comment/like/:commentId', likeOrUnlikeComment); // ✅ Like/Unlike in one API


module.exports = router;