const express = require('express');

const { register, login, logout, getMe } = require('../controllers/authController');
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/authValidators');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
