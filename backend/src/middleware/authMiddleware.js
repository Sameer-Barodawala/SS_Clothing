const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { errorResponse } = require('../utils/response');

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json(errorResponse('No token provided'));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(errorResponse('Invalid or expired token'));
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json(errorResponse('Access denied. Admin only.'));
  }
  next();
};