const express = require('express');
const { registerUser, loginUser, refreshToken, validateToken } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Refresh token
router.post('/refresh', refreshToken);

// validate token
router.get('/validate-token', authMiddleware, validateToken);

module.exports = router;
