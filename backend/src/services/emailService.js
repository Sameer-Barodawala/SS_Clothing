const nodemailer = require('nodemailer');
const { EMAIL_TYPES } = require('../config/constants');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to, subject, html, text = '') {
    try {
      const mailOptions = {
        from: `${process.env.APP_NAME || 'SS Clothing'} <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to SS Clothing!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome ${user.name}!</h1>
        <p>Thank you for registering with SS Clothing.</p>
        <p>We're excited to have you as part of our community.</p>
        <p>Start shopping now and explore our latest collections!</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
           style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          Start Shopping
        </a>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  async sendOrderConfirmation(user, order) {
    const subject = `Order Confirmation - #${order.id}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmed!</h1>
        <p>Hi ${user.name},</p>
        <p>Thank you for your order. Your order has been confirmed.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order Details</h2>
          <p><strong>Order ID:</strong> #${order.id}</p>
          <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> ₹${order.total_amount}</p>
          <p><strong>Payment Method:</strong> ${order.payment_method}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>

        <p>We'll send you a shipping confirmation email when your order ships.</p>
        
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}" 
           style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          View Order
        </a>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  async sendOrderShipped(user, order, trackingNumber) {
    const subject = `Your Order has been Shipped - #${order.id}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Shipped!</h1>
        <p>Hi ${user.name},</p>
        <p>Great news! Your order has been shipped.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Shipping Details</h2>
          <p><strong>Order ID:</strong> #${order.id}</p>
          <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
        </div>

        <p>You can track your order using the tracking number above.</p>
        
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}" 
           style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          Track Order
        </a>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const subject = 'Password Reset Request';
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password.</p>
        <p>Click the button below to reset your password:</p>
        
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
          Reset Password
        </a>

        <p style="margin-top: 20px;">This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }
}

module.exports = new EmailService();