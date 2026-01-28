const { User } = require('../models/User');
const { hashPassword } = require('../utils/hash');
const { successResponse, errorResponse } = require('../utils/response');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Remove password from response
    delete user.password;

    return successResponse(res, user, 'Profile fetched successfully', HTTP_STATUS.OK);
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, address, city, state, zip_code, country } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return errorResponse(res, 'Email already in use', HTTP_STATUS.CONFLICT);
      }
    }

    const updateData = {
      name: name || user.name,
      email: email || user.email,
      phone: phone !== undefined ? phone : user.phone,
      address: address !== undefined ? address : user.address,
      city: city !== undefined ? city : user.city,
      state: state !== undefined ? state : user.state,
      zip_code: zip_code !== undefined ? zip_code : user.zip_code,
      country: country !== undefined ? country : user.country
    };

    await User.update(userId, updateData);
    const updatedUser = await User.findById(userId);
    delete updatedUser.password;

    return successResponse(res, updatedUser, 'Profile updated successfully', HTTP_STATUS.OK);
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Verify current password
    const bcrypt = require('bcrypt');
    const isValidPassword = await bcrypt.compare(current_password, user.password);
    if (!isValidPassword) {
      return errorResponse(res, 'Current password is incorrect', HTTP_STATUS.BAD_REQUEST);
    }

    // Hash new password
    const hashedPassword = await hashPassword(new_password);
    await User.update(userId, { password: hashedPassword });

    return successResponse(res, null, 'Password changed successfully', HTTP_STATUS.OK);
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    const users = await User.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      role,
      search
    });

    // Remove passwords from response
    users.data = users.data.map(user => {
      delete user.password;
      return user;
    });

    return successResponse(res, users, 'Users fetched successfully', HTTP_STATUS.OK);
  } catch (error) {
    console.error('Get all users error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// Get user by ID (Admin only)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return errorResponse(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    delete user.password;

    return successResponse(res, user, 'User fetched successfully', HTTP_STATUS.OK);
  } catch (error) {
    console.error('Get user by ID error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    await User.update(id, { role });
    const updatedUser = await User.findById(id);
    delete updatedUser.password;

    return successResponse(res, updatedUser, 'User role updated successfully', HTTP_STATUS.OK);
  } catch (error) {
    console.error('Update user role error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (parseInt(id) === req.user.id) {
      return errorResponse(res, 'Cannot delete your own account', HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    await User.delete(id);

    return successResponse(res, null, 'User deleted successfully', HTTP_STATUS.OK);
  } catch (error) {
    console.error('Delete user error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const orders = await User.getOrders(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      status
    });

    return successResponse(res, orders, 'Orders fetched successfully', HTTP_STATUS.OK);
  } catch (error) {
    console.error('Get user orders error:', error);
    return errorResponse(res, ERROR_MESSAGES.SERVER_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};