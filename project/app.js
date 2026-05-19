require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const AppError = require('./utils/AppError');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5500',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Sports Events API is running'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.use((req, res, next) => {
    next(new AppError(`Маршрут ${req.originalUrl} не знайдено`, 404));
});

app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        err = new AppError(err.message, 400);
    } else if (err.name === 'CastError') {
        err = new AppError('Некоректний ID ресурсу', 400);
    } else if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        err = new AppError(`Значення поля ${field} має бути унікальним`, 409);
    } else if (err.name === 'JsonWebTokenError') {
        err = new AppError('Невірний токен. Увійдіть знову', 401);
    } else if (err.name === 'TokenExpiredError') {
        err = new AppError('Термін дії токена вийшов. Увійдіть знову', 401);
    }

    if (!err.isOperational) {
        console.error('Unhandled error:', err);
    }

    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Внутрішня помилка сервера';

    res.status(statusCode).json({
        success: false,
        message
    });
});

if (!process.env.JWT_SECRET) {
    console.error('JWT configuration error: set JWT_SECRET in .env');
    process.exit(1);
}

if (!process.env.JWT_EXPIRES_IN) {
    console.error('JWT configuration error: set JWT_EXPIRES_IN in .env');
    process.exit(1);
}

if (!mongoUri) {
    console.error('MongoDB connection error: set MONGO_URI or MONGODB_URI in .env');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    });
