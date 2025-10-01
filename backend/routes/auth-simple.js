const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

// Mock users for demo (no database needed!)
const MOCK_USERS = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@municipality.gov.in',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8TZ7oeKMx.H1Z8XnrJpLZ8Vjh/5cJy', // admin123
    fullName: 'Municipal Admin',
    role: 'admin',
    user_type: 'official'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    password: '$2a$10$CwTycUXWue0Thq9StjUM0uJ8TZ7oeKMx.H1Z8XnrJpLZ8Vjh/5cJy', // admin123
    fullName: 'Resident User',
    role: 'user',
    user_type: 'household'
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
    const { username, email, password } = req.body;

    // Check if user already exists in mock users
    const existingUser = MOCK_USERS.find(u => u.username === username || u.email === email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create mock user
    const newUser = {
      id: MOCK_USERS.length + 1,
      username: username || `user${MOCK_USERS.length + 1}`,
      email: email || `user${MOCK_USERS.length + 1}@example.com`,
      password: await bcrypt.hash(password || 'password123', 10),
      fullName: username || 'New User',
      role: 'user',
      user_type: 'household'
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
    res.status(400).json({ error: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Find user in mock users
    const user = MOCK_USERS.find(u => 
      u.username === (username || email) || u.email === (email || username)
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
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

