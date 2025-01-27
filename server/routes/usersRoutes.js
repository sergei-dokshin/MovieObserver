const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getAuthUser,
  updateUser
} = require('../controllers/userController');
const upload = require('../middlewares/images.middleware');
const { authCheck } = require('../middlewares/auth.middleware');

// Получить всех пользователей
router.get('/', authCheck, getAllUsers);

// Получить авторизированного пользователя(наличие токенов в localstorage)
router.get('/authUser', authCheck, getAuthUser);

// Получить пользователя по ID
router.get('/:userId', authCheck, getUserById);

// Обновить данные пользователя (включая аватар)
router.patch('/:userId/update', authCheck, upload.single('avatar'), updateUser);

module.exports = router;
