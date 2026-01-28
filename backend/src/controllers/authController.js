const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/env');
const { successResponse, errorResponse } = require('../utils/response');

exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json(errorResponse('Email already registered'));
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user
    const userId = await User.create({
      email,
      password_hash,
      first_name,
      last_name,
      phone
    });

    const user = await User.findById(userId);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.status(201).json(successResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    }, 'Registration successful'));
  } catch (error) {
    res.status(500).json(errorResponse('Registration failed', error.message));
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json(errorResponse('Invalid credentials'));
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json(successResponse({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    }, 'Login successful'));
  } catch (error) {
    res.status(500).json(errorResponse('Login failed', error.message));
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(successResponse({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role
    }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get user', error.message));
  }
};