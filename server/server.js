const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

// Создаем приложение Express
const app = express();
// получаем значение порта из файла config/default.json
const PORT = config.get('port');

// Подключаем middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Делаем папку "uploads" доступной для запросов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Регистрируем маршруты
const allRoutes = require('./routes/index');

app.use('/api', allRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client')));

  const indexPath = path.join(__dirname, 'client', 'index.html');

  app.get('*', (req, res) => {
    res.sendFile(indexPath);
  });
}

async function start() {
  try {
    // Подключаемся к базе данных
    await mongoose
      .connect(config.get('mongoUriAtlas'))
      .then(() => console.log('Connected to MongoDB'));

    // Запуск сервера
    app.get('/', (req, res) => res.send('Server is running'));
    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

start();
