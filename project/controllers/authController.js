const bcrypt = require('bcryptjs');

const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            confirmPassword,
            role
        } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password and confirmPassword are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
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
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
