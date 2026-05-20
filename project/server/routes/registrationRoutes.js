const express = require('express');

const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const { createRegistrationSchema } = require('../validators/registrationValidators');
const {
    getRegistrations,
    createRegistration,
    deleteRegistration
} = require('../controllers/registrationController');

const router = express.Router({ mergeParams: true });

router.get('/', getRegistrations);
router.post('/', protect, validate(createRegistrationSchema), createRegistration);
router.delete('/:id', protect, deleteRegistration);

module.exports = router;
