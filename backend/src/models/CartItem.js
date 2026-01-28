const db = require('../config/db');

class CartItem {
  static async findByCartId(cartId) {
    const [rows] = await db.query(
      `SELECT ci.*, 
              p.name as product_name, 
              p.price, 
              p.images as product_image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    
    return rows.map(row => {
      let imageUrl = null;
      
      // Safely parse product_image
      if (row.product_image) {
        try {
          // Try parsing as JSON array
          const images = JSON.parse(row.product_image);
          imageUrl = Array.isArray(images) ? images[0] : images;
        } catch (e) {
          // If not JSON, treat as plain string or comma-separated
          if (row.product_image.includes(',')) {
            imageUrl = row.product_image.split(',')[0].trim();
          } else {
            imageUrl = row.product_image;
          }
        }
      }
      
      return {
        ...row,
        product_image: imageUrl
      };
    });
  }

  static async findByCartAndProduct(cartId, productId, size, color) {
    const [rows] = await db.query(
      `SELECT * FROM cart_items 
       WHERE cart_id = ? AND product_id = ? AND size = ? AND color = ?`,
      [cartId, productId, size, color]
    );
    return rows[0];
  }

  static async create(data) {
    const [result] = await db.query('INSERT INTO cart_items SET ?', data);
    return result.insertId;
  }

  static async updateQuantity(itemId, quantity) {
    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, itemId]
    );
  }

  static async delete(itemId) {
    await db.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
  }

  static async deleteByCartId(cartId) {
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
  }
}

module.exports = CartItem;