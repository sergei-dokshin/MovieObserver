const express = require('express');
const router = express.Router();
const { getAllHobbies } = require('../controllers/hobbiesController');

// Получить всех пользователей
router.get('/', getAllHobbies);

module.exports = router;
