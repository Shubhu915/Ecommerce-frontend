const express = require('express');
const { register, verifyEmail, login, logout, refreshToken, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get('/verify-email', verifyEmail);
router.get('/me', protect, getMe);

module.exports = router;
