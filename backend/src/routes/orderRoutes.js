const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate); // All order routes require authentication

router.post('/', orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', isAdmin, orderController.updateOrderStatus);

module.exports = router;