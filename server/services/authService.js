const User = require('../models/User');

exports.signUp = (payload) => {
  return User.create(payload);
};
