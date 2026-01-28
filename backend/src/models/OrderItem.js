const db = require('../config/db');

class OrderItem {
  static async findByOrderId(orderId) {
    const [rows] = await db.query(
      `SELECT oi.*, p.name as product_name, p.images as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    
    return rows.map(row => ({
      ...row,
      product_image: row.product_image ? JSON.parse(row.product_image)[0] : null
    }));
  }

  static async create(data) {
    const [result] = await db.query('INSERT INTO order_items SET ?', data);
    return result.insertId;
  }
}

module.exports = OrderItem;