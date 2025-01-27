const { body } = require('express-validator');

const signUpValidator = [
  body('email', 'Некорректный email').isEmail(),
  body('password', 'Минимальная длина пароля 8 символов').isLength({ min: 8 })
];

const logInValidator = [
  body('email', 'Некорректный email').isEmail(),
  body('password', 'Пароль не может быть пустым').exists()
];

module.exports = { signUpValidator, logInValidator };
