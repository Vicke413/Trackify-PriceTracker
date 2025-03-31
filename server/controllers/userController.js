const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Register a new user
 * @route POST /api/users/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password
    });
    
    await user.save();
    
    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * Login a user
 * @route POST /api/users/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * Get authenticated user
 * @route GET /api/users/me
 */
exports.getMe = async (req, res) => {
  try {
    // User is already available in req.user from auth middleware
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, priceAlertThreshold, avatar } = req.body;
    
    // Find user by ID
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (priceAlertThreshold !== undefined) user.priceAlertThreshold = priceAlertThreshold;
    if (avatar) user.avatar = avatar;
    
    await user.save();
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

/**
 * Update user password
 * @route PUT /api/users/password
 */
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user by ID
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
}; 