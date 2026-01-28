const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/products', categoryController.getProductsByCategory);

// Admin routes
router.post('/', authenticate, isAdmin, categoryController.createCategory);
router.put('/:id', authenticate, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticate, isAdmin, categoryController.deleteCategory);

module.exports = router;