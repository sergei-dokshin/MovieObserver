const { Schema, model } = require('mongoose');

const tokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Экспортируем модель Token
module.exports = model('Token', tokenSchema, 'tokens');
