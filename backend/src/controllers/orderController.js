const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const { successResponse, errorResponse } = require('../utils/response');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shipping_address, billing_address, payment_method, total_amount } = req.body;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const orderId = await Order.create({
      user_id: userId,
      order_number: orderNumber,
      total_amount,
      shipping_address: JSON.stringify(shipping_address),
      billing_address: JSON.stringify(billing_address),
      payment_method,
      status: 'pending',
      payment_status: 'pending'
    });

    // Create order items
    for (const item of items) {
      await OrderItem.create({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color
      });
    }

    // Clear cart
    const cart = await Cart.findByUserId(userId);
    if (cart) {
      await CartItem.deleteByCartId(cart.id);
    }

    const order = await Order.findById(orderId);
    res.status(201).json(successResponse(order, 'Order created successfully'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to create order', error.message));
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.findByUserId(userId);
    
    res.json(successResponse(orders));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get orders', error.message));
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const order = await Order.findById(id);
    
    if (!order || order.user_id !== userId) {
      return res.status(404).json(errorResponse('Order not found'));
    }

    const items = await OrderItem.findByOrderId(id);
    
    res.json(successResponse({
      ...order,
      items
    }));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to get order', error.message));
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await Order.updateStatus(id, status);
    const order = await Order.findById(id);
    
    res.json(successResponse(order, 'Order status updated'));
  } catch (error) {
    res.status(500).json(errorResponse('Failed to update order', error.message));
  }
};