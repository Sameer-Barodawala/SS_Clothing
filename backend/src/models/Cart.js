const db = require('../config/db');

class Cart {
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM carts WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.query(
      'SELECT * FROM carts WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }

  static async create(userId) {
    const [result] = await db.query(
      'INSERT INTO carts (user_id) VALUES (?)',
      [userId]
    );
    return result.insertId;
  }

  static async delete(id) {
    await db.query('DELETE FROM carts WHERE id = ?', [id]);
  }
}

module.exports = Cart;