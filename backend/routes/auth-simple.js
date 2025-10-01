const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Mock users for demo (no database needed!)
// Password for all users: admin123
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@municipality.gov.in',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8TZ7oeKMx.H1Z8XnrJpLZ8Vjh/5cJy', // admin123
    fullName: 'Municipal Admin',
    role: 'admin',
    user_type: 'official',
    mobile_number: '9999999999',
    municipality_name: 'Mumbai Municipal Corporation',
    location: 'Mumbai, Maharashtra',
    household_size: 1,
    device_id: 'ADMIN-001'
  },
  {
    id: 2,
    username: 'User-1',
    email: 'user1@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8TZ7oeKMx.H1Z8XnrJpLZ8Vjh/5cJy', // admin123
    fullName: 'Rajesh Kumar',
    role: 'user',
    user_type: 'household',
    mobile_number: '9876543210',
    municipality_name: '',
    location: 'Andheri, Mumbai',
    household_size: 4,
    device_id: 'FLV-1001'
  },
  {
    id: 3,
    username: 'User-2',
    email: 'user2@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8TZ7oeKMx.H1Z8XnrJpLZ8Vjh/5cJy', // admin123
    fullName: 'Priya Sharma',
    role: 'user',
    user_type: 'household',
    mobile_number: '9876543211',
    municipality_name: '',
    location: 'Bandra, Mumbai',
    household_size: 3,
    device_id: 'FLV-1002'
  },
  {
    id: 4,
    username: 'User-3',
    email: 'user3@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8TZ7oeKMx.H1Z8XnrJpLZ8Vjh/5cJy', // admin123
    fullName: 'Amit Patel',
    role: 'user',
    user_type: 'household',
    mobile_number: '9876543212',
    municipality_name: '',
    location: 'Powai, Mumbai',
    household_size: 5,
    device_id: 'FLV-1003'
  },
  {
    id: 5,
    username: 'resident',
    email: 'resident@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8TZ7oeKMx.H1Z8XnrJpLZ8Vjh/5cJy', // admin123
    fullName: 'Demo Resident',
    role: 'user',
    user_type: 'household',
    mobile_number: '9999888877',
    municipality_name: '',
    location: 'Mumbai, Maharashtra',
    household_size: 2,
    device_id: 'FLV-DEMO'
  }
];

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      username: user.username,
      role: user.role 
    },
    config.SECRET_KEY,
    { expiresIn: config.JWT_EXPIRY }
  );
}

// Register endpoint (mock - just returns success)
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
    const finalUsername = username || `user_${MOCK_USERS.length + 1}`;
    const finalEmail = email || `${finalUsername}@flowveda.local`;
    const finalPassword = password || 'defaultpass123';
    const userType = user_type && ['household', 'official'].includes(user_type) 
      ? user_type 
      : 'household';

    // Check if user already exists in mock users
    const existingUser = MOCK_USERS.find(u => u.username === finalUsername || u.email === finalEmail);
    
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create mock user
    const newUser = {
      id: MOCK_USERS.length + 1,
      username: finalUsername,
      email: finalEmail,
      password: await bcrypt.hash(finalPassword, 10),
      fullName: finalUsername,
      role: userType === 'official' ? 'admin' : 'user',
      user_type: userType,
      mobile_number: mobile_number || '',
      municipality_name: municipality_name || '',
      location: location || '',
      household_size: household_size || 1,
      device_id: device_id || ''
    };

    MOCK_USERS.push(newUser);

    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        user_type: newUser.user_type
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

    // Find user in mock users (search by username or email)
    const user = MOCK_USERS.find(u => 
      u.username === username || u.email === username
    );

    if (!user) {
      return res.status(401).json({ detail: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
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
        user_type: user.user_type
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, config.SECRET_KEY);
    
    // Find user
    const user = MOCK_USERS.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      user_type: user.user_type
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;

