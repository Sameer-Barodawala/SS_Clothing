const jwt = require('jsonwebtoken');
const { JWT } = require('../config/constants');

/**
 * Generate JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: JWT.ACCESS_TOKEN_EXPIRY }
  );
};

/**
 * Generate JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: JWT.REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Verify JWT token
 */
const verifyToken = (token, isRefreshToken = false) => {
  try {
    const secret = isRefreshToken
      ? process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      : process.env.JWT_SECRET;
    
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode JWT token without verification
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Generate token pair (access + refresh)
 */
const generateTokenPair = (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  return {
    accessToken,
    refreshToken
  };
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = verifyToken(refreshToken, true);
    
    // Generate new access token with same payload
    const newAccessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });
    
    return {
      success: true,
      accessToken: newAccessToken
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Extract token from Authorization header
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
};

/**
 * Generate email verification token
 */
const generateEmailVerificationToken = (email) => {
  return jwt.sign(
    { email, purpose: 'email_verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

/**
 * Generate password reset token
 */
const generatePasswordResetToken = (userId, email) => {
  return jwt.sign(
    { userId, email, purpose: 'password_reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Verify special purpose token (email verification, password reset)
 */
const verifySpecialToken = (token, expectedPurpose) => {
  try {
    const decoded = verifyToken(token);
    
    if (decoded.purpose !== expectedPurpose) {
      throw new Error('Invalid token purpose');
    }
    
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  generateTokenPair,
  refreshAccessToken,
  extractTokenFromHeader,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifySpecialToken
};