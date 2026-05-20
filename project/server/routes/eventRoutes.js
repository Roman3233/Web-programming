const express = require('express');
const registrationRouter = require('./registrationRoutes');

const {
    getAllEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');
const validate = require('../middleware/validate');
const {
    createEventSchema,
    updateEventSchema
} = require('../validators/eventValidators');

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEvent);

router.post('/', protect, validate(createEventSchema), createEvent);
router.put('/:id', protect, validate(updateEventSchema), updateEvent);

router.delete('/:id', protect, restrictTo('admin'), deleteEvent);
router.use('/:eventId/registrations', registrationRouter);

module.exports = router;
