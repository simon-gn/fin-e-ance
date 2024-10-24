const express = require('express');
const { registerUser, loginUser, refreshToken } = require('../controllers/authController');
const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Login User
router.post('/refresh', refreshToken);

module.exports = router;
