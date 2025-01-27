const express = require('express');
const router = express.Router();
const {
  postNewComment,
  getCommentsForUser,
  deleteComment
} = require('../controllers/commentsController');
const { authCheck } = require('../middlewares/auth.middleware');

// Создать новый комментарий
router.post('/create', authCheck, postNewComment);

// Получить все комментарии для конкретного пользователя по ID
router.get('/:userId', authCheck, getCommentsForUser);

// Удалить комментарий на странице пользователя
router.delete('/:commentId', authCheck, deleteComment);

module.exports = router;
