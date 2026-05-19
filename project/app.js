require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const AppError = require('./utils/AppError');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

app.use(express.json());

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
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Внутрішня помилка сервера';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

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
