const { Category } = require('../models/Category');
const { successResponse, errorResponse } = require('../utils/response');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(successResponse(categories, 'Categories fetched successfully'));
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json(errorResponse('Failed to fetch categories', error.message));
  }
};

// Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json(errorResponse('Category not found'));
    }

    res.json(successResponse(category, 'Category fetched successfully'));
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json(errorResponse('Failed to fetch category', error.message));
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findBySlug(slug);

    if (!category) {
      return res.status(404).json(errorResponse('Category not found'));
    }

    res.json(successResponse(category, 'Category fetched successfully'));
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json(errorResponse('Failed to fetch category', error.message));
  }
};

// Create new category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, parent_id } = req.body;

    const existingCategory = await Category.findBySlug(slug);
    if (existingCategory) {
      return res.status(409).json(errorResponse('Category with this slug already exists'));
    }

    const categoryData = {
      name,
      slug,
      description,
      image,
      parent_id: parent_id || null
    };

    const categoryId = await Category.create(categoryData);
    const category = await Category.findById(categoryId);

    res.status(201).json(successResponse(category, 'Category created successfully'));
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json(errorResponse('Failed to create category', error.message));
  }
};

// Update category (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image, parent_id, is_active } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json(errorResponse('Category not found'));
    }

    if (slug && slug !== category.slug) {
      const existingCategory = await Category.findBySlug(slug);
      if (existingCategory && existingCategory.id !== parseInt(id)) {
        return res.status(409).json(errorResponse('Category with this slug already exists'));
      }
    }

    const updateData = {
      name: name || category.name,
      slug: slug || category.slug,
      description: description !== undefined ? description : category.description,
      image: image || category.image,
      parent_id: parent_id !== undefined ? parent_id : category.parent_id,
      is_active: is_active !== undefined ? is_active : category.is_active
    };

    await Category.update(id, updateData);
    const updatedCategory = await Category.findById(id);

    res.json(successResponse(updatedCategory, 'Category updated successfully'));
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json(errorResponse('Failed to update category', error.message));
  }
};

// Delete category (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json(errorResponse('Category not found'));
    }

    await Category.delete(id);

    res.json(successResponse(null, 'Category deleted successfully'));
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json(errorResponse('Failed to delete category', error.message));
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json(errorResponse('Category not found'));
    }

    const products = await Category.getProducts(id, parseInt(page), parseInt(limit));

    res.json(successResponse(products, 'Products fetched successfully'));
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json(errorResponse('Failed to fetch products', error.message));
  }
};