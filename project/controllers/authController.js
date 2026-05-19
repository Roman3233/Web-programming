const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

const generateToken = (id, role) =>
    jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

exports.register = catchAsync(async (req, res) => {
    const user = await authService.registerUser(req.body);
    const token = generateToken(user._id, user.role);

    res.status(201).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

exports.login = catchAsync(async (req, res) => {
    const user = await authService.loginUser(req.body);
    const token = generateToken(user._id, user.role);

    res.status(200).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
});

exports.getMe = catchAsync(async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});
