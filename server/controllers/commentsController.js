const Comment = require('../models/Comment');
const commentsService = require('../services/commentsService');

// Создать новый комментарий
exports.postNewComment = async (req, res) => {
  try {
    // дополнительно указываем в поле userId идентификатор авторизированного пользователя
    const newComment = await commentsService.postNewComment({
      ...req.body,
      authorId: req.authUser._id
    });
    // Если комментарий успешно создан
    if (newComment) {
      // заполняем данные об авторе перед отправкой ответа
      const populatedComment = await newComment.populate('authorId');
      res.status(201).send(populatedComment);
    } else {
      res.status(400).json({ message: 'Failed to post comment.' });
    }
  } catch (error) {
    // Ошибка может быть вызвана неверным форматом данных или другими проблемами
    res.status(500).json({
      message: `Error during posting: ${error.message}`
    });
  }
};

// Получить все комментарии для конкретного пользователя по ID
exports.getCommentsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const comments = await commentsService.getCommentsForUser(userId);

    if (comments && comments.length > 0) {
      res.json(comments);
    } else {
      // Если комментариев нет, возвращаем пустой массив с кодом 200
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({
      message: `Error getting comments: ${error.message}`
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const authUserId = req.authUser._id;

    // находим нужный комментарий в Базе данных
    const comment = await Comment.findById(commentId);
    const authorId = comment.authorId.toString();
    const userId = comment.userId.toString();

    if (authUserId === authorId || authUserId === userId) {
      const response = await commentsService.deleteComment(commentId);

      // в ответе также возвращаем данные удаленного комментария для возможности его восстановления
      res.status(200).json(response);
    } else {
      res.status(401).json({ message: 'UNAUTHORIZED: not allowed to delete' });
    }
  } catch (error) {
    // Ошибка может быть вызвана неверным форматом данных или другими проблемами
    res.status(500).json({
      message: `Failed to delete comment: ${error.message}`
    });
  }
};
