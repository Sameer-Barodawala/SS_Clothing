const express = require('express');
const productController = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/black-friday', productController.getBlackFridayDeals);
router.get('/:id', productController.getProductById);

// Admin routes with image upload
router.post('/', 
  authenticate, 
  isAdmin, 
  upload.array('images', 5), // Allow up to 5 images
  productController.createProduct
);

router.put('/:id', 
  authenticate, 
  isAdmin, 
  upload.array('images', 5),
  productController.updateProduct
);

router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);

module.exports = router;