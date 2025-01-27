const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    occupation: { type: String, default: '' },
    birthDate: { type: Number, required: true },
    hobbies: [{ type: Schema.Types.ObjectId, ref: 'Hobby' }],
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wikiPage: { type: String, default: '' },
    avatar: { type: String, default: '' } // Поле для хранения пути к аватару
  },
  { timestamps: true }
);

module.exports = model('User', userSchema, 'users');
