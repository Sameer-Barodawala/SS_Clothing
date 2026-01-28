import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product, showDiscount, showNewBadge }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const calculateDiscount = () => {
    if (product.sale_price && product.price) {
      return Math.round(((product.price - product.sale_price) / product.price) * 100);
    }
    return product.black_friday_discount || 0;
  };

  const finalPrice = product.sale_price || product.price;
  const discount = calculateDiscount();

  // Parse images - handle both string and array
  let imageUrl = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400';
  try {
    if (product.images) {
      const images = typeof product.images === 'string' 
        ? JSON.parse(product.images) 
        : product.images;
      imageUrl = images[0] || imageUrl;
    }
  } catch (e) {
    console.error('Error parsing images:', e);
  }

  // Get default size and color
  const getDefaultOptions = () => {
    try {
      const sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes || [];
      const colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors || [];
      return {
        size: sizes[0] || 'M',
        color: colors[0] || 'Default'
      };
    } catch (e) {
      return { size: 'M', color: 'Default' };
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.warning('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (isAdding) return;

    setIsAdding(true);
    const { size, color } = getDefaultOptions();
    
    try {
      await addToCart(product.id, 1, size, color);
    } catch (error) {
      console.error('Add to cart error:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.warning('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success('Added to wishlist!');
    } else {
      toast.info('Removed from wishlist');
    }
  };

  // Format price safely
  const formatPrice = (price) => {
    const numPrice = Number(price);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  return (
    <div className="product-card">
      {showNewBadge && product.is_new_arrival && (
        <div className="badge new-badge">NEW</div>
      )}
      {showDiscount && discount > 0 && (
        <div className="badge discount-badge">-{discount}%</div>
      )}
      
      <Link to={`/products/${product.id}`} className="product-image-link">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400';
          }}
        />
      </Link>

      <div className="product-info">
        <Link to={`/products/${product.id}`} className="product-name">
          {product.name}
        </Link>
        
        {product.brand && (
          <p className="product-brand">{product.brand}</p>
        )}

        <div className="product-price">
          <span className="current-price">
            ₹{formatPrice(finalPrice)}
          </span>
          {product.sale_price && (
            <span className="original-price">
              ₹{formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="product-actions">
          <button 
            className={`btn-wishlist ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            aria-label="Add to wishlist"
          >
            <FaHeart />
          </button>
          <button 
            className="btn-add-cart"
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
          >
            <FaShoppingCart /> {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;