require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ApiError = require('./errors/ApiError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

connectDB();

app.use(express.json());
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// 404 middleware after all routes
app.use((req, res, next) => {
 next(new ApiError(404, 'Маршрут не знайдено'));
});

// Error handler must be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));
