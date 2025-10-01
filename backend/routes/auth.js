const express = require('express');
const router = express.Router();
const { User, UserProfile } = require('../models');
const { generateToken } = require('../middleware/auth');

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      user_type,
      mobile_number,
      municipality_name,
      location,
      household_size,
      device_id
    } = req.body;

    // Generate defaults if not provided
    const finalUsername = username || `user_${await User.count() + 1}`;
    const finalEmail = email || `${finalUsername}@flowveda.local`;
    const finalPassword = password || 'defaultpass123';
    const userType = user_type && ['household', 'official'].includes(user_type) 
      ? user_type 
      : 'household';

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { username: finalUsername } 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create user
    const user = await User.create({
      username: finalUsername,
      email: finalEmail,
      password: finalPassword
    });

    // Create user profile
    await UserProfile.create({
      userId: user.id,
      userType: userType,
      mobileNumber: mobile_number || '',
      municipalityName: municipality_name || '',
      location: location || '',
      householdSize: household_size || 1,
      deviceId: device_id || ''
    });

    // Generate token
    const token = generateToken(user);

    // Fetch user with profile for response
    const userWithProfile = await User.findByPk(user.id, {
      include: [{ model: UserProfile, as: 'profile' }],
      attributes: { exclude: ['password'] }
    });

    res.status(201).json({
      token,
      user: {
        id: userWithProfile.id,
        username: userWithProfile.username,
        email: userWithProfile.email,
        user_type: userWithProfile.profile ? userWithProfile.profile.userType : 'household'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ 
      where: { username },
      include: [{ model: UserProfile, as: 'profile' }]
    });

    if (!user) {
      return res.status(401).json({ detail: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ detail: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        user_type: user.profile ? user.profile.userType : 'household'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;

