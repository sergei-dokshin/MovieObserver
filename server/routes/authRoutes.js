const express = require('express');
const router = express.Router();
const {
  signUp,
  logIn,
  refreshToken
} = require('../controllers/authController');
const {
  signUpValidator,
  logInValidator
} = require('../utilities/validators/authValidators');
const upload = require('../middlewares/images.middleware');

// Регистрация пользователя с middleware для обработки изображения и валидации
router.post('/signUp', upload.single('avatar'), signUpValidator, signUp);

// Авторизация пользователя с подключением middleware для валидации
router.post('/signInWithPassword', logInValidator, logIn);

// Проверить токен
router.post('/token', refreshToken);

module.exports = router;
