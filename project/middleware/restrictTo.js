const AppError = require('../utils/AppError');

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('У вас немає прав для цієї дії', 403));
        }

        next();
    };
};

module.exports = restrictTo;
