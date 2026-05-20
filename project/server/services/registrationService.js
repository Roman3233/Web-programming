const Event = require('../models/Event');
const Registration = require('../models/Registration');
const AppError = require('../utils/AppError');

exports.getRegistrationsByEvent = async (eventId) => {
    return Registration.find({ event: eventId }).populate('user', 'name email');
};

exports.createRegistration = async (data, eventId, userId) => {
    const event = await Event.findById(eventId);

    if (!event) {
        throw new AppError('Подію не знайдено', 404);
    }

    return Registration.create({
        ...data,
        event: eventId,
        user: userId
    });
};

exports.deleteRegistration = async (registrationId, currentUser) => {
    const registration = await Registration.findById(registrationId);

    if (!registration) {
        throw new AppError('Реєстрацію не знайдено', 404);
    }

    if (
        registration.user.toString() !== currentUser._id.toString() &&
        currentUser.role !== 'admin'
    ) {
        throw new AppError('Ви не маєте прав видалити цю реєстрацію', 403);
    }

    await registration.deleteOne();
    return registration;
};
