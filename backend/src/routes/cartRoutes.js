const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate); // All cart routes require authentication

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;