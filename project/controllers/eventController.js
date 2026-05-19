const Event = require('../models/Event');
const AppError = require('../utils/AppError');

exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find().populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (err) {
        next(err);
    }
};

exports.getEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

        if (!event) {
            return next(new AppError('Подію не знайдено', 404));
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (err) {
        next(err);
    }
};

exports.createEvent = async (req, res, next) => {
    try {
        const event = await Event.create({
            ...req.body,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (err) {
        next(err);
    }
};

exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!event) {
            return next(new AppError('Подію не знайдено', 404));
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return next(new AppError('Подію не знайдено', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Подію видалено'
        });
    } catch (err) {
        next(err);
    }
};
