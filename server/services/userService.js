const User = require('../models/User');
require('../models/Hobby'); // супер важно импортировать модель используется в .populate( )!
require('../models/HobbyType'); // супер важно импортировать модель используется в .populate( )!

exports.fetchAllUsers = () => User.find();

exports.fetchUserById = (userId) => {
  return User.findById(userId).populate({
    path: 'hobbies',
    populate: {
      path: 'type',
      model: 'HobbyType'
    }
  });
};

exports.fetchAuthUser = (userId) => {
  return User.findById(userId);
};

exports.editUser = (userId, updatedData) =>
  User.findByIdAndUpdate(userId, updatedData, { new: true }).populate(
    'hobbies'
  );

