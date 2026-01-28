const db = require('../config/db');

class User {
  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async create(userData) {
    const [result] = await db.query('INSERT INTO users SET ?', userData);
    return result.insertId;
  }

  static async update(id, userData) {
    await db.query('UPDATE users SET ? WHERE id = ?', [userData, id]);
  }

  static async delete(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
  }
}

module.exports = User;