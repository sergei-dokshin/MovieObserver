const { Schema, model } = require('mongoose');

const hobbyTypeSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true }
});

// третий параметр указывает из какой коллекции в БД брать данные
module.exports = model('HobbyType', hobbyTypeSchema, 'hobby_types');
