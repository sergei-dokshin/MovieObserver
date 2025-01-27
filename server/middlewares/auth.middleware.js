const tokenHandler = require('../utilities/tokenHandler');

exports.authCheck = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // получаем токен из Header authorization: Bearer TdXbIHBbUGjniUFYTFYVGklvbuilg;oihujhuj...
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'UNAUTHORIZED: No token provided' });
    }
    // проверяем подлинность токена
    const data = tokenHandler.validateAccessToken(token);

    if (!data) {
      return res
        .status(401)
        .json({ message: 'UNAUTHORIZED: Failed Access Token validation' });
    }
    // добавляем в request данные о пользователе, которому принадлежит токен
    req.authUser = data;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'UNAUTHORIZED' });
  }
};
