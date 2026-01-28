import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaStar, FaTruck, FaUndo, FaBolt } from 'react-icons/fa';
import { productAPI } from '../../api/productAPI';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader/Loader';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      
      // Handle different response structures
      const productData = response.data.data || response.data;
      
      if (!productData || !productData.id) {
        throw new Error('No product data received');
      }

      setProduct(productData);

      // Safely parse sizes - handle both JSON and comma-separated strings
      try {
        let parsedSizes = [];
        if (productData.sizes) {
          if (typeof productData.sizes === 'string') {
            try {
              parsedSizes = JSON.parse(productData.sizes);
            } catch (e) {
              if (productData.sizes.includes(',')) {
                parsedSizes = productData.sizes.split(',').map(s => s.trim());
              } else {
                parsedSizes = [productData.sizes];
              }
            }
          } else if (Array.isArray(productData.sizes)) {
            parsedSizes = productData.sizes;
          }
        }
        // Set the FIRST size as selected, not the array
        if (parsedSizes.length > 0) {
          setSelectedSize(parsedSizes[0]);
        }
      } catch (parseError) {
        console.error('Error parsing sizes:', parseError);
      }

      // Safely parse colors - handle both JSON and comma-separated strings
      try {
        let parsedColors = [];
        if (productData.colors) {
          if (typeof productData.colors === 'string') {
            try {
              parsedColors = JSON.parse(productData.colors);
            } catch (e) {
              if (productData.colors.includes(',')) {
                parsedColors = productData.colors.split(',').map(c => c.trim());
              } else {
                parsedColors = [productData.colors];
              }
            }
          } else if (Array.isArray(productData.colors)) {
            parsedColors = productData.colors;
          }
        }
        // Set the FIRST color as selected, not the array
        if (parsedColors.length > 0) {
          setSelectedColor(parsedColors[0]);
        }
      } catch (parseError) {
        console.error('Error parsing colors:', parseError);
      }
      
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.warning('Please login to add items to cart');
      navigate('/login');
      return;
    }

    // Ensure size and color are strings, not arrays
    const finalSize = Array.isArray(selectedSize) ? selectedSize[0] : selectedSize;
    const finalColor = Array.isArray(selectedColor) ? selectedColor[0] : selectedColor;

    if (!finalSize || !finalColor) {
      toast.warning('Please select size and color');
      return;
    }

    console.log('Adding to cart:', {
      productId: product.id,
      quantity,
      size: finalSize,
      color: finalColor
    });

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity, finalSize, finalColor);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.warning('Please login to continue');
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    // Ensure size and color are strings, not arrays
    const finalSize = Array.isArray(selectedSize) ? selectedSize[0] : selectedSize;
    const finalColor = Array.isArray(selectedColor) ? selectedColor[0] : selectedColor;

    if (!finalSize || !finalColor) {
      toast.warning('Please select size and color');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity, finalSize, finalColor);
      navigate('/checkout');
    } finally {
      setAddingToCart(false);
    }
  };

  const calculateDiscount = () => {
    if (product.sale_price && product.price) {
      const salePrice = parseFloat(product.sale_price);
      const regularPrice = parseFloat(product.price);
      return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
    }
    return product.black_friday_discount || 0;
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!product) return null;

  // Safely parse images - handle both JSON array and comma-separated string
  let images = [];
  try {
    if (product.images) {
      if (typeof product.images === 'string') {
        try {
          images = JSON.parse(product.images);
        } catch (e) {
          if (product.images.includes(',')) {
            images = product.images.split(',').map(img => img.trim());
          } else {
            images = [product.images];
          }
        }
      } else if (Array.isArray(product.images)) {
        images = product.images;
      }
    }
  } catch (e) {
    console.error('Error parsing images:', e);
  }
  if (images.length === 0) {
    images = ['https://via.placeholder.com/600x800'];
  }

  // Safely parse sizes - handle both JSON array and comma-separated string
  let sizes = [];
  try {
    if (product.sizes) {
      if (typeof product.sizes === 'string') {
        try {
          sizes = JSON.parse(product.sizes);
        } catch (e) {
          if (product.sizes.includes(',')) {
            sizes = product.sizes.split(',').map(s => s.trim());
          } else {
            sizes = [product.sizes];
          }
        }
      } else if (Array.isArray(product.sizes)) {
        sizes = product.sizes;
      }
    }
  } catch (e) {
    console.error('Error parsing sizes:', e);
  }

  // Safely parse colors - handle both JSON array and comma-separated string
  let colors = [];
  try {
    if (product.colors) {
      if (typeof product.colors === 'string') {
        try {
          colors = JSON.parse(product.colors);
        } catch (e) {
          if (product.colors.includes(',')) {
            colors = product.colors.split(',').map(c => c.trim());
          } else {
            colors = [product.colors];
          }
        }
      } else if (Array.isArray(product.colors)) {
        colors = product.colors;
      }
    }
  } catch (e) {
    console.error('Error parsing colors:', e);
  }

  // Convert prices to numbers
  const finalPrice = parseFloat(product.sale_price || product.price);
  const originalPrice = parseFloat(product.price);
  const discount = calculateDiscount();

  return (
    <div className="product-details-page">
      <div className="container">
        <div className="product-details-grid">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              {discount > 0 && (
                <div className="discount-badge">-{discount}%</div>
              )}
              <img src={images[selectedImage]} alt={product.name} />
            </div>
            
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            {product.brand && (
              <p className="product-brand">{product.brand}</p>
            )}
            
            <h1 className="product-title">{product.name}</h1>

            {/* Ratings */}
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="star filled" />
                ))}
              </div>
              <span className="rating-text">4.5 (248 reviews)</span>
            </div>

            {/* Price */}
            <div className="product-price-section">
              <div className="price-row">
                <span className="current-price">₹{finalPrice.toFixed(2)}</span>
                {product.sale_price && (
                  <span className="original-price">₹{originalPrice.toFixed(2)}</span>
                )}
                {discount > 0 && (
                  <span className="save-amount">Save ₹{(originalPrice - finalPrice).toFixed(2)}</span>
                )}
              </div>
              {product.black_friday_deal && (
                <div className="black-friday-tag">
                  🔥 Black Friday Deal!
                </div>
              )}
            </div>

            {/* Description */}
            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="product-options">
                <label className="option-label">
                  Size: <strong>{selectedSize}</strong>
                </label>
                <div className="size-options">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="product-options">
                <label className="option-label">
                  Color: <strong>{selectedColor}</strong>
                </label>
                <div className="color-options">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="product-options">
              <label className="option-label">Quantity:</label>
              <div className="quantity-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button
                className="btn-add-to-cart"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
              >
                <FaShoppingCart /> {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              
              <button
                className="btn-buy-now"
                onClick={handleBuyNow}
                disabled={product.stock === 0 || addingToCart}
              >
                <FaBolt /> {addingToCart ? 'Processing...' : 'Buy Now'}
              </button>
              
              <button className="btn-wishlist">
                <FaHeart />
              </button>
            </div>

            {/* Features */}
            <div className="product-features">
              <div className="feature-item">
                <FaTruck />
                <div>
                  <strong>Free Shipping</strong>
                  <p>On orders over ₹500</p>
                </div>
              </div>
              <div className="feature-item">
                <FaUndo />
                <div>
                  <strong>Easy Returns</strong>
                  <p>30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-tabs">
          <div className="tab-content">
            <h3>Product Details</h3>
            <ul>
              <li><strong>Brand:</strong> {product.brand || 'Fashion Brand'}</li>
              <li><strong>Category:</strong> {product.category_name}</li>
              <li><strong>Material:</strong> 100% Premium Cotton</li>
              <li><strong>Care:</strong> Machine wash cold, tumble dry low</li>
              <li><strong>Imported:</strong> Yes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;