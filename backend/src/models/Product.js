// backend/src/models/Product.js

const db = require('../config/db');

class Product {
  // Find all products with filters
  static async findAll(filters = {}, limit = 20, offset = 0, sortBy = 'created_at', order = 'DESC') {
    let query = `
      SELECT p.*, 
             c.name as category_name,
             c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];

    // Category filter (supports both category_id and category slug)
    if (filters.category) {
      query += ` AND (c.slug = ? OR p.category_id = ?)`;
      params.push(filters.category, filters.category);
    }

    // Featured filter
    if (filters.featured) {
      query += ` AND p.is_featured = 1`;
    }

    // New Arrival filter
    if (filters.newArrival) {
      query += ` AND p.is_new_arrival = 1`;
    }

    // Black Friday filter
    if (filters.blackFriday) {
      query += ` AND p.black_friday_deal = 1`;
    }

    // Deals filter (products with sale_price)
    if (filters.deals) {
      query += ` AND p.sale_price IS NOT NULL AND p.sale_price < p.price`;
    }

    // Search filter
    if (filters.search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Price range filter
    if (filters.minPrice) {
      query += ` AND p.price >= ?`;
      params.push(filters.minPrice);
    }
    if (filters.maxPrice) {
      query += ` AND p.price <= ?`;
      params.push(filters.maxPrice);
    }

    // Sorting
    const allowedSortFields = ['created_at', 'price', 'name', 'rating', 'views'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY p.${sortField} ${sortOrder}`;
    
    // Pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await db.query(query, params);
    return products;
  }

  // Count products with filters
  static async count(filters = {}) {
    let query = `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = 1
    `;
    const params = [];

    // Apply same filters as findAll
    if (filters.category) {
      query += ` AND (c.slug = ? OR p.category_id = ?)`;
      params.push(filters.category, filters.category);
    }

    if (filters.featured) {
      query += ` AND p.is_featured = 1`;
    }

    if (filters.newArrival) {
      query += ` AND p.is_new_arrival = 1`;
    }

    if (filters.blackFriday) {
      query += ` AND p.black_friday_deal = 1`;
    }

    if (filters.deals) {
      query += ` AND p.sale_price IS NOT NULL AND p.sale_price < p.price`;
    }

    if (filters.search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.minPrice) {
      query += ` AND p.price >= ?`;
      params.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      query += ` AND p.price <= ?`;
      params.push(filters.maxPrice);
    }

    const [result] = await db.query(query, params);
    return result[0].total;
  }

  // Find product by ID
  static async findById(id) {
    const query = `
      SELECT p.*, 
             c.name as category_name,
             c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    
    const [products] = await db.query(query, [id]);
    
    if (products.length > 0) {
      // Increment views
      await db.query('UPDATE products SET views = views + 1 WHERE id = ?', [id]);
    }
    
    return products[0] || null;
  }

  // Find product by slug
  static async findBySlug(slug) {
    const query = `
      SELECT p.*, 
             c.name as category_name,
             c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.is_active = 1
    `;
    
    const [products] = await db.query(query, [slug]);
    
    if (products.length > 0) {
      await db.query('UPDATE products SET views = views + 1 WHERE slug = ?', [slug]);
    }
    
    return products[0] || null;
  }

  // Find featured products
  static async findFeatured(limit = 10) {
    const query = `
      SELECT p.*, 
             c.name as category_name,
             c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = 1 AND p.is_active = 1
      ORDER BY p.created_at DESC
      LIMIT ?
    `;
    
    const [products] = await db.query(query, [parseInt(limit)]);
    return products;
  }

  // Find new arrivals
  static async findNewArrivals(limit = 10) {
    const query = `
      SELECT p.*, 
             c.name as category_name,
             c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_new_arrival = 1 AND p.is_active = 1
      ORDER BY p.created_at DESC
      LIMIT ?
    `;
    
    const [products] = await db.query(query, [parseInt(limit)]);
    return products;
  }

  // Find Black Friday deals
  static async findBlackFridayDeals(limit = 20) {
    const query = `
      SELECT p.*, 
             c.name as category_name,
             c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.black_friday_deal = 1 AND p.is_active = 1
      ORDER BY p.black_friday_discount DESC, p.created_at DESC
      LIMIT ?
    `;
    
    const [products] = await db.query(query, [parseInt(limit)]);
    return products;
  }

  // Create new product
  static async create(productData) {
    const {
      name,
      slug,
      sku,
      description,
      price,
      sale_price,
      category_id,
      brand,
      sizes,
      colors,
      stock_quantity,
      images,
      is_featured,
      is_new_arrival,
      black_friday_deal,
      black_friday_discount
    } = productData;

    const query = `
      INSERT INTO products (
        name, slug, sku, description, price, sale_price, category_id, 
        brand, sizes, colors, stock_quantity, images, is_featured, 
        is_new_arrival, black_friday_deal, black_friday_discount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      name,
      slug,
      sku || `PROD-${Date.now()}`,
      description,
      price,
      sale_price || null,
      category_id || null,
      brand || null,
      sizes || null,
      colors || null,
      stock_quantity || 0,
      images || null,
      is_featured || 0,
      is_new_arrival || 0,
      black_friday_deal || 0,
      black_friday_discount || 0
    ]);

    return result.insertId;
  }

  // Update product
  static async update(id, productData) {
    const fields = [];
    const values = [];

    // Dynamically build update query based on provided fields
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);

    const query = `
      UPDATE products 
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  }

  // Soft delete (set is_active to 0)
  static async delete(id) {
    const query = 'UPDATE products SET is_active = 0 WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Hard delete (permanently remove)
  static async hardDelete(id) {
    const query = 'DELETE FROM products WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Update stock quantity
  static async updateStock(id, quantity) {
    const query = 'UPDATE products SET stock_quantity = ? WHERE id = ?';
    const [result] = await db.query(query, [quantity, id]);
    return result.affectedRows > 0;
  }

  // Decrease stock (for orders)
  static async decreaseStock(id, quantity) {
    const query = `
      UPDATE products 
      SET stock_quantity = stock_quantity - ? 
      WHERE id = ? AND stock_quantity >= ?
    `;
    const [result] = await db.query(query, [quantity, id, quantity]);
    return result.affectedRows > 0;
  }

  // Update rating
  static async updateRating(id, newRating) {
    const query = `
      UPDATE products 
      SET rating = (rating * rating_count + ?) / (rating_count + 1),
          rating_count = rating_count + 1
      WHERE id = ?
    `;
    const [result] = await db.query(query, [newRating, id]);
    return result.affectedRows > 0;
  }

  // Get related products (same category)
  static async getRelated(productId, limit = 4) {
    const query = `
      SELECT p2.*, c.name as category_name, c.slug as category_slug
      FROM products p1
      JOIN products p2 ON p1.category_id = p2.category_id
      LEFT JOIN categories c ON p2.category_id = c.id
      WHERE p1.id = ? 
        AND p2.id != ? 
        AND p2.is_active = 1
      ORDER BY RAND()
      LIMIT ?
    `;
    
    const [products] = await db.query(query, [productId, productId, limit]);
    return products;
  }
}

module.exports = Product;