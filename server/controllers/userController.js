const userService = require('../services/userService');
const multer = require('multer');
const fs = require('fs');

// Получить всех пользователей
async function getAllUsers(req, res) {
  try {
    const users = await userService.fetchAllUsers();
    res.send(users);
  } catch (error) {
    res.status(500).json({
      message: `Ошибка загрузки данных о пользователях: ${error.message}`
    });
  }
}

// Получить пользователя по ID
async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    const user = await userService.fetchUserById(userId);
    if (user) {
      res.send(user);
    } else {
      res.status(401).json({ message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({
      message: `Ошибка загрузки данных о пользователе(byId): ${error.message}`
    });
  }
}

async function getAuthUser(req, res) {
  const requestUserId = req.authUser._id;

  try {
    const user = await userService.fetchAuthUser(requestUserId);
    if (user) {
      res.status(200).json(user);
    } else {
      res
        .status(401)
        .json({ message: 'Пользователь с таким токеном не найден' });
    }
  } catch (error) {
    res.status(500).json({
      message: `1Ошибка загрузки данных о пользователе: ${error.message}`
    });
  }
}

async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const data = req.body;

    // заголовок authUser добавляется middleware - authCheck
    const authUserId = req.authUser._id;

    // проверяем, пытается ли пользователь поменять данные в собственном аккаунте или нет
    if (userId !== authUserId) {
      return res.status(401).json({
        message: 'UNAUTHORIZED'
      });
    }

    // Получаем нужного пользователя
    const existingUser = await userService.fetchAuthUser(userId);

    // Добавляем путь к новому аватару в данные пользователя
    if (req.file) {
      // Удаляем старый аватар, если он есть
      if (existingUser.avatar) {
        fs.unlink(existingUser.avatar, (err) => {
          if (err) {
            throw new Error('Failed to delete old avatar:', err);
          }
        });
      }
      data.avatar = req.file.path;
    }

    // Обновляем данные пользователя
    const updatedUser = await userService.editUser(userId, data);

    return res.send(updatedUser);
  } catch (error) {
    // Обработка ошибок Multer
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    // Обработка других ошибок
    res.status(500).json({
      message: `Ошибка обновления данных пользователя: ${error.message}`
    });
  }
}

async function checkUserEmailExists(req, res) {
  try {
    const { email } = req.query;
    const user = await userService.getUserByEmail(email);

    if (user) {
      res
        .status(200)
        .json({ status: 1, message: 'Пользователь с таким email существует' });
    } else {
      res.status(200).json({ status: 0, message: 'Пользователь не найден' });
    }
  } catch (error) {
    res.status(500).json({
      message: `Ошибка загрузки данных о пользователе(byEmail): ${error.message}`
    });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  getAuthUser,
  updateUser,
  checkUserEmailExists
};
