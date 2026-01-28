import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaShoppingCart, 
  FaUser, 
  FaHeart, 
  FaChevronDown, 
  FaSignOutAlt,
  FaTimes,
  FaBell,
  FaGift,
  FaHeadset,
  FaTshirt,
  FaTag
} from 'react-icons/fa';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { productAPI } from '../../api/productAPI';
import './Navbar.css';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showShopMenu, setShowShopMenu] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const userMenuTimeoutRef = useRef(null);
  const shopMenuTimeoutRef = useRef(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchActive]);

  const loadCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to static categories
      setCategories([
        { id: 1, name: 'Men', slug: 'men' },
        { id: 2, name: 'Women', slug: 'women' },
        { id: 3, name: 'Kids', slug: 'kids' },
        { id: 4, name: 'Accessories', slug: 'accessories' },
        { id: 5, name: 'Shoes', slug: 'shoes' },
        { id: 6, name: 'Bags', slug: 'bags' }
      ]);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearchClick = () => {
    setSearchActive(true);
  };

  const handleSearchClose = () => {
    setSearchActive(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      handleSearchClose();
    }
  };

  // User menu handlers
  const handleUserMenuEnter = () => {
    if (userMenuTimeoutRef.current) {
      clearTimeout(userMenuTimeoutRef.current);
    }
    setShowUserMenu(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeoutRef.current = setTimeout(() => {
      setShowUserMenu(false);
    }, 200);
  };

  // Shop menu handlers
  const handleShopMenuEnter = () => {
    if (shopMenuTimeoutRef.current) {
      clearTimeout(shopMenuTimeoutRef.current);
    }
    setShowShopMenu(true);
  };

  const handleShopMenuLeave = () => {
    shopMenuTimeoutRef.current = setTimeout(() => {
      setShowShopMenu(false);
    }, 200);
  };

  return (
    <>
      {/* Search Overlay */}
      <div 
        className={`search-overlay ${searchActive ? 'active' : ''}`}
        onClick={handleSearchClose}
      ></div>

      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            SS CLOTHING
          </Link>

          {/* Animated Search Bar */}
          <div className={`search-container ${searchActive ? 'active' : ''}`}>
            <form onSubmit={handleSearchSubmit}>
              <div className="search-input-wrapper">
                <FaSearch style={{ color: 'var(--text-secondary)', marginRight: '10px' }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="button" 
                  className="search-close-btn"
                  onClick={handleSearchClose}
                >
                  <FaTimes />
                </button>
              </div>
            </form>
          </div>

          <ul className="navbar-menu">
            <li><Link to="/">Home</Link></li>
            
            {/* Shop Mega Menu */}
            <li 
              className="dropdown-menu-item mega-menu-item"
              onMouseEnter={handleShopMenuEnter}
              onMouseLeave={handleShopMenuLeave}
            >
              <Link to="/products" className="dropdown-trigger">
                Shop <FaChevronDown className="dropdown-icon" />
              </Link>
              
              {showShopMenu && (
                <div className="mega-menu-dropdown">
                  <div className="mega-menu-content">
                    {/* Categories Grid */}
                    <div className="mega-menu-section">
                      <h3 className="mega-menu-title">
                        <FaTshirt /> Shop by Category
                      </h3>
                      <div className="categories-grid">
                        {categories.map(category => (
                          <Link 
                            key={category.id} 
                            to={`/products?category=${category.slug}`}
                            className="category-item"
                            onClick={() => setShowShopMenu(false)}
                          >
                            <span className="category-name">{category.name}</span>
                            {category.product_count > 0 && (
                              <span className="category-count">({category.product_count})</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mega-menu-section featured-section">
                      <h3 className="mega-menu-title">
                        <FaTag /> Featured
                      </h3>
                      <div className="featured-links">
                        <Link 
                          to="/products?newArrival=true" 
                          className="featured-link"
                          onClick={() => setShowShopMenu(false)}
                        >
                          <div className="featured-badge new">NEW</div>
                          <span>New Arrivals</span>
                        </Link>
                        <Link 
                          to="/products?deals=true" 
                          className="featured-link"
                          onClick={() => setShowShopMenu(false)}
                        >
                          <div className="featured-badge hot">HOT</div>
                          <span>Hot Deals</span>
                        </Link>
                        <Link 
                          to="/products?featured=true" 
                          className="featured-link"
                          onClick={() => setShowShopMenu(false)}
                        >
                          <div className="featured-badge trending">⭐</div>
                          <span>Trending Now</span>
                        </Link>
                        <Link 
                          to="/products" 
                          className="featured-link view-all-link"
                          onClick={() => setShowShopMenu(false)}
                        >
                          <span>View All Products →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
            
            <li><Link to="/products?newArrival=true">New Arrivals</Link></li>
            <li><Link to="/products?deals=true">Deals</Link></li>
          </ul>

          <div className="navbar-actions">
            {/* Search Icon */}
            <div className="navbar-icon" onClick={handleSearchClick}>
              <FaSearch />
            </div>

            {/* Notifications Icon */}
            <div className="navbar-icon" title="Notifications">
              <FaBell />
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="navbar-icon wishlist-link" title="Wishlist">
              <FaHeart />
            </Link>

            {/* Offers Icon */}
            <Link to="/offers" className="navbar-icon" title="Special Offers">
              <FaGift />
            </Link>
            
            {/* Cart */}
            <Link to="/cart" className="navbar-icon cart-icon-link" title="Shopping Cart">
              <FaShoppingCart />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>

            {/* Support */}
            <Link to="/support" className="navbar-icon" title="Customer Support">
              <FaHeadset />
            </Link>

            {/* User Menu */}
            {user ? (
              <div 
                className="user-menu"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <div className="navbar-icon user-icon">
                  <FaUser />
                </div>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <p className="user-name">{user.name || user.email}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    {user.role === 'admin' && (
                      <>
                        <Link to="/admin/dashboard" className="user-dropdown-item">
                          Admin Dashboard
                        </Link>
                        <div className="user-dropdown-divider"></div>
                      </>
                    )}
                    <Link to="/orders" className="user-dropdown-item">
                      My Orders
                    </Link>
                    <Link to="/profile" className="user-dropdown-item">
                      Profile Settings
                    </Link>
                    <div className="user-dropdown-divider"></div>
                    <button onClick={handleLogout} className="user-dropdown-item logout-btn">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="navbar-icon login-link" 
                title="Login"
                style={{ textDecoration: 'none' }}
              >
                <FaUser />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;