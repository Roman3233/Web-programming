const Joi = require('joi');

const eventFields = {
    name: Joi.string().min(2).max(100).messages({
        'string.min': 'Назва події має містити мінімум 2 символи',
        'string.max': 'Назва події має містити максимум 100 символів'
    }),
    sport: Joi.string().min(2).max(50).messages({
        'string.min': 'Вид спорту має містити мінімум 2 символи',
        'string.max': 'Вид спорту має містити максимум 50 символів'
    }),
    date: Joi.date().iso().messages({
        'date.base': 'Вкажіть коректну дату події',
        'date.format': 'Дата має бути у форматі ISO'
    }),
    location: Joi.string().min(2).max(120).messages({
        'string.min': 'Локація має містити мінімум 2 символи',
        'string.max': 'Локація має містити максимум 120 символів'
    }),
    maxParticipants: Joi.number().integer().min(1).max(100000).messages({
        'number.base': 'Максимальна кількість учасників має бути числом',
        'number.min': 'Максимальна кількість учасників має бути не менше 1',
        'number.max': 'Максимальна кількість учасників має бути не більше 100000'
    })
};

exports.createEventSchema = Joi.object({
    name: eventFields.name.required().messages({
        'any.required': 'Назва події обов\'язкова'
    }),
    sport: eventFields.sport.required().messages({
        'any.required': 'Вид спорту обов\'язковий'
    }),
    date: eventFields.date.required().messages({
        'any.required': 'Дата події обов\'язкова'
    }),
    location: eventFields.location.required().messages({
        'any.required': 'Локація обов\'язкова'
    }),
    maxParticipants: eventFields.maxParticipants.required().messages({
        'any.required': 'Максимальна кількість учасників обов\'язкова'
    })
});

exports.updateEventSchema = Joi.object({
    name: eventFields.name,
    sport: eventFields.sport,
    date: eventFields.date,
    location: eventFields.location,
    maxParticipants: eventFields.maxParticipants
}).min(1).messages({
    'object.min': 'Потрібно передати хоча б одне поле для оновлення'
});
