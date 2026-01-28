const Product = require('../models/Product');
const { successResponse, errorResponse } = require('../utils/response');

exports.getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      featured, 
      newArrival, 
      blackFriday,
      deals,
      search,
      minPrice,
      maxPrice,
      sortBy = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    
    const filters = {
      category: category || null,
      featured: featured === 'true',
      newArrival: newArrival === 'true',
      blackFriday: blackFriday === 'true',
      deals: deals === 'true',
      search: search || null,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null
    };

    const products = await Product.findAll(filters, limit, offset, sortBy, order);
    const total = await Product.count(filters);

    res.json(successResponse({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + products.length < total
      }
    }));
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json(errorResponse('Failed to fetch products', error.message));
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== GET PRODUCT BY ID ===');
    console.log('Requested ID:', id);
    console.log('ID Type:', typeof id);
    
    const product = await Product.findById(id);
    console.log('Product found:', product ? 'YES' : 'NO');
    
    if (!product) {
      console.log('Product not found in database');
      return res.status(404).json(errorResponse('Product not found'));
    }

    console.log('Returning product:', product.name);
    res.json(successResponse(product));
  } catch (error) {
    console.error('=== GET PRODUCT BY ID ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json(errorResponse('Failed to fetch product', error.message));
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.findFeatured(limit);
    res.json(successResponse(products));
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json(errorResponse('Failed to fetch featured products', error.message));
  }
};

exports.getNewArrivals = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.findNewArrivals(limit);
    res.json(successResponse(products));
  } catch (error) {
    console.error('Get new arrivals error:', error);
    res.status(500).json(errorResponse('Failed to fetch new arrivals', error.message));
  }
};

exports.getBlackFridayDeals = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const products = await Product.findBlackFridayDeals(limit);
    res.json(successResponse(products));
  } catch (error) {
    console.error('Get Black Friday deals error:', error);
    res.status(500).json(errorResponse('Failed to fetch Black Friday deals', error.message));
  }
};

exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => 
        `/uploads/products/${file.filename}`
      );
      productData.images = JSON.stringify(imageUrls);
    }
    
    if (productData.sizes && typeof productData.sizes === 'string') {
      try {
        JSON.parse(productData.sizes);
      } catch (e) {
        const sizesArray = productData.sizes.split(',').map(s => s.trim());
        productData.sizes = JSON.stringify(sizesArray);
      }
    }
    
    if (productData.colors && typeof productData.colors === 'string') {
      try {
        JSON.parse(productData.colors);
      } catch (e) {
        const colorsArray = productData.colors.split(',').map(c => c.trim());
        productData.colors = JSON.stringify(colorsArray);
      }
    }
    
    const productId = await Product.create(productData);
    const product = await Product.findById(productId);
    res.status(201).json(successResponse(product, 'Product created successfully'));
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json(errorResponse('Failed to create product', error.message));
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => 
        `/uploads/products/${file.filename}`
      );
      productData.images = JSON.stringify(imageUrls);
    }
    
    if (productData.sizes && typeof productData.sizes === 'string') {
      try {
        JSON.parse(productData.sizes);
      } catch (e) {
        const sizesArray = productData.sizes.split(',').map(s => s.trim());
        productData.sizes = JSON.stringify(sizesArray);
      }
    }
    
    if (productData.colors && typeof productData.colors === 'string') {
      try {
        JSON.parse(productData.colors);
      } catch (e) {
        const colorsArray = productData.colors.split(',').map(c => c.trim());
        productData.colors = JSON.stringify(colorsArray);
      }
    }
    
    await Product.update(id, productData);
    const product = await Product.findById(id);
    res.json(successResponse(product, 'Product updated successfully'));
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json(errorResponse('Failed to update product', error.message));
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.delete(id);
    res.json(successResponse(null, 'Product deleted successfully'));
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json(errorResponse('Failed to delete product', error.message));
  }
};