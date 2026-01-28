const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PAYMENT_METHODS, PAYMENT_STATUS } = require('../config/constants');

class PaymentService {
  // Create payment intent (Stripe)
  async createPaymentIntent(amount, currency = 'inr', metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to smallest currency unit
        currency,
        metadata
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Verify payment
  async verifyPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        paymentMethod: paymentIntent.payment_method
      };
    } catch (error) {
      console.error('Payment verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Process refund
  async processRefund(paymentIntentId, amount = null) {
    try {
      const refundData = { payment_intent: paymentIntentId };
      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }

      const refund = await stripe.refunds.create(refundData);

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      };
    } catch (error) {
      console.error('Refund processing failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Validate COD (Cash on Delivery)
  validateCOD(orderAmount, maxCODAmount = 50000) {
    if (orderAmount > maxCODAmount) {
      return {
        success: false,
        error: `COD is not available for orders above ₹${maxCODAmount}`
      };
    }
    return { success: true };
  }

  // Process UPI payment (Mock implementation - integrate with actual UPI gateway)
  async processUPI(upiId, amount, orderId) {
    try {
      // This is a mock implementation
      // In production, integrate with actual UPI payment gateway like Razorpay, PayU, etc.
      
      console.log(`Processing UPI payment: ${upiId}, Amount: ${amount}, Order: ${orderId}`);
      
      // Simulate payment processing
      return {
        success: true,
        transactionId: `UPI_${Date.now()}`,
        status: PAYMENT_STATUS.PAID
      };
    } catch (error) {
      console.error('UPI payment failed:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PaymentService();