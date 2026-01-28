const db = require('../config/db');

class Category {
  // Find all categories
  static async findAll() {
    const query = `
      SELECT c.*,
             COUNT(DISTINCT p.id) as product_count,
             parent.name as parent_name
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      LEFT JOIN categories parent ON c.parent_id = parent.id
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    
    const [categories] = await db.query(query);
    return categories;
  }

  // Find category by ID
  static async findById(id) {
    const query = `
      SELECT c.*,
             COUNT(DISTINCT p.id) as product_count,
             parent.name as parent_name
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      LEFT JOIN categories parent ON c.parent_id = parent.id
      WHERE c.id = ?
      GROUP BY c.id
    `;
    
    const [categories] = await db.query(query, [id]);
    return categories[0] || null;
  }

  // Find category by slug
  static async findBySlug(slug) {
    const query = `
      SELECT c.*,
             COUNT(DISTINCT p.id) as product_count,
             parent.name as parent_name
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      LEFT JOIN categories parent ON c.parent_id = parent.id
      WHERE c.slug = ?
      GROUP BY c.id
    `;
    
    const [categories] = await db.query(query, [slug]);
    return categories[0] || null;
  }

  // Create new category
  static async create(categoryData) {
    const { name, slug, description, image, parent_id } = categoryData;
    
    const query = `
      INSERT INTO categories (name, slug, description, image, parent_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const [result] = await db.query(query, [name, slug, description, image, parent_id]);
    return result.insertId;
  }

  // Update category
  static async update(id, categoryData) {
    const { name, slug, description, image, parent_id, is_active } = categoryData;
    
    const query = `
      UPDATE categories 
      SET name = ?, 
          slug = ?, 
          description = ?, 
          image = ?, 
          parent_id = ?,
          is_active = ?,
          updated_at = NOW()
      WHERE id = ?
    `;
    
    const [result] = await db.query(query, [
      name, 
      slug, 
      description, 
      image, 
      parent_id,
      is_active,
      id
    ]);
    
    return result.affectedRows > 0;
  }

  // Delete category (soft delete)
  static async delete(id) {
    const query = `
      UPDATE categories 
      SET is_active = 0, updated_at = NOW()
      WHERE id = ?
    `;
    
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Hard delete category
  static async hardDelete(id) {
    const query = 'DELETE FROM categories WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  }

  // Get products by category
  static async getProducts(categoryId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const countQuery = `
      SELECT COUNT(*) as total
      FROM products
      WHERE category_id = ? AND is_active = 1
    `;
    
    const [countResult] = await db.query(countQuery, [categoryId]);
    const total = countResult[0].total;

    const query = `
      SELECT p.*,
             c.name as category_name,
             c.slug as category_slug,
             (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.is_active = 1
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [products] = await db.query(query, [categoryId, limit, offset]);

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Get subcategories
  static async getSubcategories(parentId) {
    const query = `
      SELECT c.*,
             COUNT(DISTINCT p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      WHERE c.parent_id = ? AND c.is_active = 1
      GROUP BY c.id
      ORDER BY c.name ASC
    `;
    
    const [subcategories] = await db.query(query, [parentId]);
    return subcategories;
  }

  // Get category tree (hierarchical structure)
  static async getCategoryTree() {
    const query = `
      SELECT c.*,
             COUNT(DISTINCT p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY c.parent_id, c.name ASC
    `;
    
    const [categories] = await db.query(query);

    // Build tree structure
    const categoryMap = {};
    const tree = [];

    categories.forEach(category => {
      categoryMap[category.id] = { ...category, children: [] };
    });

    categories.forEach(category => {
      if (category.parent_id) {
        if (categoryMap[category.parent_id]) {
          categoryMap[category.parent_id].children.push(categoryMap[category.id]);
        }
      } else {
        tree.push(categoryMap[category.id]);
      }
    });

    return tree;
  }
}

module.exports = { Category };