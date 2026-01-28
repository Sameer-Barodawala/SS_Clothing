const db = require('../config/db');

class Order {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }

  static async create(data) {
    const [result] = await db.query('INSERT INTO orders SET ?', data);
    return result.insertId;
  }

  static async updateStatus(id, status) {
    await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
  }

  static async updatePaymentStatus(id, paymentStatus) {
    await db.query(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      [paymentStatus, id]
    );
  }
}

module.exports = Order;
