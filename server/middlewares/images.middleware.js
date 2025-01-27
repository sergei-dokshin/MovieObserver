const multer = require("multer");
const path = require("path");


// Multer для загрузки изображений
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Папка для сохранения изображений
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Генерация уникального имени для файла
    }
});

// Ограничения на типы файлов и размер
const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Файл должен быть изображением"), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера файла (5 МБ)
    fileFilter
});

module.exports = upload;