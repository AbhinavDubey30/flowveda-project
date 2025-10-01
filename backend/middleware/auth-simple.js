const jwt = require('jsonwebtoken');
const config = require('../config');

// Generate JWT token (no database needed)
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    config.SECRET_KEY,
    { expiresIn: config.JWT_EXPIRY }
  );
};

// Verify JWT token middleware (no database lookup)
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader.replace('Token ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.SECRET_KEY);
    
    // Set user from token data (no database lookup)
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Optional auth middleware (doesn't require authentication)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : authHeader.replace('Token ', '');

      if (token) {
        const decoded = jwt.verify(token, config.SECRET_KEY);
        
        // Set user from token data (no database lookup)
        req.user = {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email
        };
      }
    }
  } catch (error) {
    // Silently fail for optional auth
  }
  
  next();
};

module.exports = {
  generateToken,
  verifyToken,
  optionalAuth
};

