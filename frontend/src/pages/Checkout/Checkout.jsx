import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCreditCard } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { orderAPI } from '../../api/orderAPI';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color
        })),
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone
        },
        billing_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        payment_method: 'card',
        total_amount: (cartTotal * 1.18).toFixed(2) // 18% GST
      };

      await orderAPI.createOrder(orderData);
      
      await clearCart();
      toast.success('Order placed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const gst = cartTotal * 0.18; // 18% GST
  const total = cartTotal + gst;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="section-title">Contact Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Shipping Address</h2>
              
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g., Maharashtra"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>PIN Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="6-digit PIN"
                    maxLength="6"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">
                <FaCreditCard /> Payment Information
              </h2>
              
              <div className="form-group">
                <label>Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="form-group">
                <label>Cardholder Name *</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>CVV *</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>

              <div className="secure-note">
                <FaLock /> Your payment information is secure
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-place-order"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order - ₹${total.toFixed(2)}`}
            </button>
          </form>

          <div className="order-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-items">
              {cart.map((item) => (
                <div key={item.id} className="summary-item">
                  <img 
                    src={item.product_image || 'https://via.placeholder.com/80'} 
                    alt={item.product_name}
                  />
                  <div className="summary-item-details">
                    <p className="item-name">{item.product_name}</p>
                    <p className="item-meta">Size: {item.size} | Color: {item.color}</p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;