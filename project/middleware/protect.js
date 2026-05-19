const jwt = require('jsonwebtoken');

const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Доступ заборонено. Токен відсутній', 401));
    }

    const token = authHeader.split(' ')[1];

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Термін дії токена вийшов. Увійдіть знову', 401));
        }

        return next(new AppError('Невірний токен. Увійдіть знову', 401));
    }

    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new AppError('Користувача не знайдено', 401));
    }

    req.user = user;
    next();
});

module.exports = protect;
