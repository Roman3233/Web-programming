const Event = require('../models/Event');
const AppError = require('../utils/AppError');

exports.getAllEvents = async (query = {}) => {
    return Event.find(query).populate('createdBy', 'name email');
};

exports.getEventById = async (id) => {
    const event = await Event.findById(id).populate('createdBy', 'name email');

    if (!event) {
        throw new AppError('Подію не знайдено', 404);
    }

    return event;
};

exports.createEvent = async (data, userId) => {
    return Event.create({ ...data, createdBy: userId });
};

exports.updateEvent = async (id, data, currentUser) => {
    const event = await Event.findById(id);

    if (!event) {
        throw new AppError('Подію не знайдено', 404);
    }

    if (
        event.createdBy.toString() !== currentUser._id.toString() &&
        currentUser.role !== 'admin'
    ) {
        throw new AppError('Ви не маєте прав редагувати цей запис', 403);
    }

    Object.assign(event, data);
    await event.save();

    return event.populate('createdBy', 'name email');
};

exports.deleteEvent = async (id) => {
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
        throw new AppError('Подію не знайдено', 404);
    }

    return event;
};
