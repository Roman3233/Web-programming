const express = require('express');

const {
    getAllEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');
const protect = require('../middleware/protect');
const restrictTo = require('../middleware/restrictTo');

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEvent);

router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);

router.delete('/:id', protect, restrictTo('admin'), deleteEvent);

module.exports = router;
