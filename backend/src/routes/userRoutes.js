const express = require('express');
const { authenticate } = require('../middleware/authMiddleware');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

const router = express.Router();

router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(successResponse(user));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get profile', error.message));
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;
    await User.update(req.user.id, { first_name, last_name, phone });
    const user = await User.findById(req.user.id);
    res.json(successResponse(user, 'Profile updated'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update profile', error.message));
  }
});

module.exports = router;