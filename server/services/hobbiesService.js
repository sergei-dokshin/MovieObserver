const Hobby = require("../models/Hobby");

exports.getAllHobbies = () => Hobby.find();
