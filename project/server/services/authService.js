const bcrypt = require('bcryptjs');

const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.registerUser = async ({ name, email, password, confirmPassword, role }) => {
    if (!name || !email || !password || !confirmPassword) {
        throw new AppError('Name, email, password and confirmPassword are required', 400);
    }

    if (password !== confirmPassword) {
        throw new AppError('Паролі не збігаються', 400);
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
        throw new AppError('Користувач із таким email вже існує', 409);
    }

    const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        role
    });

    return user;
};

exports.loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new AppError('Введіть email та пароль', 400);
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
        throw new AppError('Невірний email або пароль', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError('Невірний email або пароль', 401);
    }

    return user;
};
