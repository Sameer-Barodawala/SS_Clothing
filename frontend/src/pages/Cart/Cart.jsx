import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, updateQuantity, removeFromCart, loading } = useCart();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <FaShoppingBag className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Add some items to get started!</p>
          <Link to="/products" className="btn-continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">Shopping Cart</h1>
        
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={item.product_image || 'https://via.placeholder.com/150'} 
                    alt={item.product_name}
                  />
                </div>

                <div className="cart-item-details">
                  <Link 
                    to={`/products/₹{item.product_id}`}
                    className="cart-item-name"
                  >
                    {item.product_name}
                  </Link>
                  
                  <div className="cart-item-meta">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>

                  <div className="cart-item-price">
                    ₹{parseFloat(item.price).toFixed(2)}
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={loading}
                    >
                      -
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-subtotal">
                    ₹{parseFloat(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    className="btn-remove"
                    onClick={() => removeFromCart(item.id)}
                    disabled={loading}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{parseFloat(cartTotal).toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">FREE</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>₹{(parseFloat(cartTotal * 0.08)).toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{parseFloat((cartTotal * 1.08)).toFixed(2)}</span>
            </div>

            <button 
              className="btn-checkout"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>

            <Link to="/products" className="btn-continue">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;