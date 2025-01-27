const jwt = require('jsonwebtoken');
const config = require('config');
const Token = require('../models/Token');

class TokenHandler {
  // генерируем токены
  generate(payload) {
    // Во всех случаях использования generate() в payload должен идти один формат: либо _id, либо id
    const accessToken = jwt.sign(payload, config.get('accessPrivateKey'), {
      expiresIn: '1h'
    });
    const refreshToken = jwt.sign(payload, config.get('refreshPrivateKey'));

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600
    };
  }
  // сохраняем refresh token в базу данных в коллекцию 'tokens'
  async saveRefreshToken(userId, refreshToken) {
    const data = await Token.findOne({ user: userId });

    // обновляем токен, если запись в базе данных уже присутствует
    if (data) {
      data.refreshToken = refreshToken;
      return data.save();
    }

    // создаем запись, если запись для данного пользователя отсутствует
    const token = await Token.create({ user: userId, refreshToken });
    return token;
  }

  validateRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, config.get('refreshPrivateKey'));
    } catch (error) {
      return null;
    }
  }

  validateAccessToken(accessToken) {
    try {
      return jwt.verify(accessToken, config.get('accessPrivateKey'));
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken) {
    try {
      const result = await Token.findOne({ refreshToken });
      return result;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenHandler();
