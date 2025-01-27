const Comment = require('../models/Comment');
require('../models/User');

// получаем комментарии для определенного пользователя, заполняем данные об авторе и сортируем по дате
exports.getCommentsForUser = (userId) => {
  return Comment.find({ userId })
    .populate('authorId', '_id name email avatar')
    .sort({ createdAt: -1 });
};

exports.postNewComment = async (data) => {
  return Comment.create(data);
};

exports.deleteComment = (_id) => {
  return Comment.findByIdAndDelete(_id);
};
