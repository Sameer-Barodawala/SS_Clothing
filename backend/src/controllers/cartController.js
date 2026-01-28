const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const { successResponse, errorResponse } = require('../utils/response');

exports.getCart = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json(errorResponse('User not authenticated'));
    }

    const userId = req.user.id;
    let cart = await Cart.findByUserId(userId);

    if (!cart) {
      const cartId = await Cart.create(userId);
      cart = await Cart.findById(cartId);
    }

    const items = await CartItem.findByCartId(cart.id);
    
    res.json(successResponse({
      cart,
      items: items || []
    }));
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json(errorResponse('Failed to get cart', error.message));
  }
};

exports.addItem = async (req, res) => {
  try {
    console.log('=== ADD ITEM TO CART ===');
    console.log('User:', req.user);
    console.log('Body:', req.body);

    if (!req.user || !req.user.id) {
      return res.status(401).json(errorResponse('User not authenticated'));
    }

    const userId = req.user.id;
    // Support both productId and product_id
    const { productId, product_id, quantity = 1, size, color } = req.body;
    const finalProductId = productId || product_id;

    if (!finalProductId) {
      return res.status(400).json(errorResponse('Product ID is required'));
    }

    if (!size || !color) {
      return res.status(400).json(errorResponse('Size and color are required'));
    }

    console.log('Product ID:', finalProductId);
    console.log('Quantity:', quantity);
    console.log('Size:', size);
    console.log('Color:', color);

    let cart = await Cart.findByUserId(userId);
    console.log('Found cart:', cart);

    if (!cart) {
      console.log('Creating new cart for user:', userId);
      const cartId = await Cart.create(userId);
      cart = await Cart.findById(cartId);
      console.log('Created cart:', cart);
    }

    // Check if item already exists in cart
    const existingItem = await CartItem.findByCartAndProduct(
      cart.id, 
      finalProductId, 
      size, 
      color
    );

    console.log('Existing item:', existingItem);

    if (existingItem) {
      console.log('Updating quantity for existing item');
      await CartItem.updateQuantity(
        existingItem.id, 
        existingItem.quantity + quantity
      );
    } else {
      console.log('Creating new cart item');
      await CartItem.create({
        cart_id: cart.id,
        product_id: finalProductId,
        quantity,
        size,
        color
      });
    }

    const items = await CartItem.findByCartId(cart.id);
    console.log('Updated cart items:', items);

    res.json(successResponse({ items }, 'Item added to cart'));
  } catch (error) {
    console.error('=== ADD ITEM ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json(errorResponse('Failed to add item', error.message));
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json(errorResponse('Quantity must be at least 1'));
    }

    await CartItem.updateQuantity(itemId, quantity);
    
    res.json(successResponse(null, 'Cart updated'));
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json(errorResponse('Failed to update item', error.message));
  }
};

exports.removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    await CartItem.delete(itemId);
    
    res.json(successResponse(null, 'Item removed from cart'));
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json(errorResponse('Failed to remove item', error.message));
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findByUserId(userId);
    
    if (cart) {
      await CartItem.deleteByCartId(cart.id);
    }
    
    res.json(successResponse(null, 'Cart cleared'));
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json(errorResponse('Failed to clear cart', error.message));
  }
};