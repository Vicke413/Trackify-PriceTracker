const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Register a new user
router.post('/register', userController.register);

// Login a user
router.post('/login', userController.login);

// Protected routes (require authentication)
router.use(authMiddleware);

// Get authenticated user
router.get('/me', userController.getMe);

// Update user profile
router.put('/profile', userController.updateProfile);

// Update user password
router.put('/password', userController.updatePassword);

module.exports = router; 