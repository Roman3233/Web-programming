const catchAsync = require('../utils/catchAsync');
const registrationService = require('../services/registrationService');

exports.getRegistrations = catchAsync(async (req, res) => {
    const registrations = await registrationService.getRegistrationsByEvent(req.params.eventId);

    res.status(200).json({
        success: true,
        count: registrations.length,
        data: registrations
    });
});

exports.createRegistration = catchAsync(async (req, res) => {
    const registration = await registrationService.createRegistration(
        req.body,
        req.params.eventId,
        req.user._id
    );

    res.status(201).json({
        success: true,
        data: registration
    });
});

exports.deleteRegistration = catchAsync(async (req, res) => {
    await registrationService.deleteRegistration(req.params.id, req.user);

    res.status(200).json({
        success: true,
        message: 'Реєстрацію видалено'
    });
});
