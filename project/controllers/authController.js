const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const AppError = require('../utils/AppError');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.register = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            confirmPassword,
            role
        } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return next(new AppError('Name, email, password and confirmPassword are required', 400));
        }

        if (password !== confirmPassword) {
            return next(new AppError('Passwords do not match', 400));
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return next(new AppError('User with this email already exists', 409));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Введіть email та пароль', 400));
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            return next(new AppError('Невірний email або пароль', 401));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError('Невірний email або пароль', 401));
        }

        const token = generateToken(user._id, user.role);

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new AppError('Користувача не знайдено', 404));
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};
