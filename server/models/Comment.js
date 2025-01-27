const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }, // Индексируем userId для оптимизации поиска комментариев
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

// Экспортируем модель Comment
module.exports = model('Comment', commentSchema, 'comments');
