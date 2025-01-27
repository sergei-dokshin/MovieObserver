const express = require('express');
const router = express.Router({ mergeParams: true });

// подключаем все маршруты в один router
router.use('/auth', require('./authRoutes'));
router.use('/users', require('./usersRoutes'));
router.use('/hobbies', require('./hobbiesRoutes'));
router.use('/comments', require('./commentsRoutes'));

module.exports = router;
