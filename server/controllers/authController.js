const authService = require('../services/authService');
const bcrypt = require('bcryptjs');
const tokenHandler = require('../utilities/tokenHandler');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Регистрация пользователя
exports.signUp = async (req, res) => {
  try {
    // валидация данных
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('errors: ', errors);

      return res.status(400).json({
        error: {
          message: 'INVALID_DATA',
          code: 400,
          data: errors.array()
        }
      });
    }

    const data = req.body;
    const { email, password } = req.body;

    // проверяем существует ли пользователь
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        error: {
          message: 'EMAIL_EXISTS',
          code: 400
        }
      });
    }

    // Добавляем путь к новому аватару в данные пользователя
    if (req.file) {
      data.avatar = req.file.path;
    }

    // шифруем пароль пользователя
    const hashedPassword = await bcrypt.hash(password, 10);

    // создаем пользователя в базе данных
    const createdUser = await authService.signUp({
      ...data,
      password: hashedPassword
    });

    // генерируем и сохраняем в базе данных токены
    const tokens = tokenHandler.generate({ _id: createdUser._id });
    await tokenHandler.saveRefreshToken(createdUser._id, tokens.refreshToken);

    // отправляем ответ содержащий токены и пользователя
    res.status(201).send({
      tokens: { ...tokens, userId: createdUser._id },
      user: createdUser
    });
  } catch (error) {
    res.status(500).json({
      message: `Ошибка при регистрации пользователя: ${error.message}`
    });
  }
};

// Вход по email и password ( /signInWithPassword )
exports.logIn = async (req, res) => {
  try {
    // валидация данных
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'INVALID_DATA',
          code: 400,
          data: errors.array()
        }
      });
    }

    const { email, password } = req.body;

    // ищем пользователя в базе данных
    const user = await User.findOne({ email });

    // в случае, если пользователь не найден возвращаем ошибку
    if (!user) {
      return res.status(400).send({
        error: {
          message: 'EMAIL_NOT_FOUND',
          code: 400
        }
      });
    }
    //сравниваем пароли - пароль из запроса и пароль из базы данных
    const isEqual = await bcrypt.compare(password, user.password);

    // в случае, если пароли не совпадают возвращаем ошибку
    if (!isEqual) {
      return res.status(400).send({
        error: {
          message: 'INVALID_PASSWORD',
          code: 400
        }
      });
    }

    // генерируем токены и сохраняем их в базе данных
    const tokens = tokenHandler.generate({ _id: user._id });
    await tokenHandler.saveRefreshToken(user._id, tokens.refreshToken);

    // отправляем ответ содержащий токены и пользователя
    res.status(201).send({
      tokens: { ...tokens, userId: user._id },
      user
    });
  } catch (error) {
    res.status(500).json({
      message: `Ошибка входа: ${error.message}`
    });
  }
};

// Обновление токенов
exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const data = tokenHandler.validateRefreshToken(refresh_token);
    const dbToken = await tokenHandler.findToken(refresh_token);

    // проверяем, валиден ли принимаемый в запросе refresh token
    if (!data || !dbToken || data._id !== dbToken?.user?.toString()) {
      return res.status(401).json({
        error: {
          message: 'UNAUTHORIZED'
        }
      });
    }
    // генерируем токены и сохраняем их в базе данных
    const tokens = tokenHandler.generate({ _id: data._id });
    await tokenHandler.saveRefreshToken(data._id, tokens.refreshToken);
    // отправляем ответ содержащий токены
    return res.status(200).send({ ...tokens, userId: data._id });
  } catch (error) {
    res.status(500).json({
      message: `Ошибка обновления токенов: ${error.message}`
    });
  }
};
