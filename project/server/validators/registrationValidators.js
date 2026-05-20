const Joi = require('joi');

exports.createRegistrationSchema = Joi.object({
    note: Joi.string().max(500).allow('').optional().messages({
        'string.max': 'Примітка має містити максимум 500 символів'
    })
});
