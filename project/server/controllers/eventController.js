const catchAsync = require('../utils/catchAsync');
const eventService = require('../services/eventService');

exports.getAllEvents = catchAsync(async (req, res) => {
    const events = await eventService.getAllEvents();

    res.status(200).json({
        success: true,
        count: events.length,
        data: events
    });
});

exports.getEvent = catchAsync(async (req, res) => {
    const event = await eventService.getEventById(req.params.id);

    res.status(200).json({
        success: true,
        data: event
    });
});

exports.createEvent = catchAsync(async (req, res) => {
    const event = await eventService.createEvent(req.body, req.user._id);

    res.status(201).json({
        success: true,
        data: event
    });
});

exports.updateEvent = catchAsync(async (req, res) => {
    const event = await eventService.updateEvent(req.params.id, req.body, req.user);

    res.status(200).json({
        success: true,
        data: event
    });
});

exports.deleteEvent = catchAsync(async (req, res) => {
    await eventService.deleteEvent(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Подію видалено'
    });
});
