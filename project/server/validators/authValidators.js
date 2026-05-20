const Joi = require('joi');

exports.registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Ім\'я має містити мінімум 2 символи',
        'string.max': 'Ім\'я має містити максимум 50 символів',
        'any.required': 'Ім\'я обов\'язкове'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Введіть коректний email',
        'any.required': 'Email обов\'язковий'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Пароль має містити мінімум 6 символів',
        'any.required': 'Пароль обов\'язковий'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Паролі не збігаються',
        'any.required': 'Підтвердження пароля обов\'язкове'
    }),
    role: Joi.string().valid('user', 'admin').optional()
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Введіть коректний email',
        'any.required': 'Email обов\'язковий'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Пароль обов\'язковий'
    })
});
