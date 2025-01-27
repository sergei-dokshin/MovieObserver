const { Schema, model } = require('mongoose');

const hobbySchema = new Schema({
  type: {
    type: Schema.Types.ObjectId,
    ref: 'HobbyType'
  },
  value: { type: String, required: true },
  label: { type: String, required: true }
});

// Экспортируем модель Hobby
module.exports = model('Hobby', hobbySchema, 'hobbies');
