import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaFilter, FaTimes, FaSearch, FaHome, FaChevronRight } from 'react-icons/fa';
import { productAPI } from '../../api/productAPI';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import ProductCard from '../../components/ProductCard/ProductCard';
import InfiniteScroll from '../../components/InfiniteScroll/InfiniteScroll';
import './Products.css';

// Category mapping for display
const CATEGORY_INFO = {
  men: { name: 'Men', icon: '👔', description: 'Stylish clothing for men' },
  women: { name: 'Women', icon: '👗', description: 'Fashionable clothing for women' },
  kids: { name: 'Kids', icon: '👶', description: 'Adorable outfits for children' },
  accessories: { name: 'Accessories', icon: '👜', description: 'Complete your look' },
  shoes: { name: 'Shoes', icon: '👟', description: 'Step up your style' },
  bags: { name: 'Bags', icon: '🎒', description: 'Carry in style' },
  tshirts: { name: 'T-Shirts', icon: '👕', description: 'Casual & comfortable' },
  shirts: { name: 'Shirts', icon: '👔', description: 'Classic & modern' },
  pants: { name: 'Pants', icon: '👖', description: 'Perfect fit guaranteed' },
  tops: { name: 'Tops', icon: '👚', description: 'Trendy collection' }
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'created_at',
    order: searchParams.get('order') || 'DESC',
    featured: searchParams.get('featured') === 'true',
    newArrival: searchParams.get('newArrival') === 'true',
    blackFriday: searchParams.get('blackFriday') === 'true',
    search: searchParams.get('search') || '',
    deals: searchParams.get('deals') === 'true'
  });

  const {
    data: products,
    loading,
    hasMore,
    loadMore,
    reset
  } = useInfiniteScroll(productAPI.getProducts, {
    limit: 20,
    filters
  });

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  // Reset and reload when filters change
  useEffect(() => {
    reset();
    loadMore();
  }, [filters]);

  // Update filters when URL changes
  useEffect(() => {
    const newFilters = {
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      sortBy: searchParams.get('sortBy') || 'created_at',
      order: searchParams.get('order') || 'DESC',
      featured: searchParams.get('featured') === 'true',
      newArrival: searchParams.get('newArrival') === 'true',
      blackFriday: searchParams.get('blackFriday') === 'true',
      deals: searchParams.get('deals') === 'true',
      search: searchParams.get('search') || ''
    };
    setFilters(newFilters);
    setSearchQuery(newFilters.search);
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateSearchParams(newFilters);
  };

  const updateSearchParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'created_at' && value !== 'DESC') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', searchQuery);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'created_at',
      order: 'DESC',
      featured: false,
      newArrival: false,
      blackFriday: false,
      deals: false,
      search: ''
    };
    setFilters(resetFilters);
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  const handleCategoryClick = (categorySlug) => {
    const newFilters = { ...filters, category: categorySlug };
    setFilters(newFilters);
    updateSearchParams(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => 
    value && value !== 'created_at' && value !== 'DESC' && key !== 'sortBy' && key !== 'order'
  ).length;

  // Get page title based on active filters
  const getPageTitle = () => {
    if (filters.search) return `Search: "${filters.search}"`;
    if (filters.category) {
      const categoryInfo = CATEGORY_INFO[filters.category.toLowerCase()];
      return categoryInfo ? `${categoryInfo.icon} ${categoryInfo.name}` : filters.category;
    }
    if (filters.blackFriday) return '🔥 Black Friday Deals';
    if (filters.deals) return '💥 Deals & Offers';
    if (filters.newArrival) return '✨ New Arrivals';
    if (filters.featured) return '⭐ Featured Products';
    return 'All Products';
  };

  // Get page description
  const getPageDescription = () => {
    if (filters.search) return `Showing results for "${filters.search}"`;
    if (filters.category) {
      const categoryInfo = CATEGORY_INFO[filters.category.toLowerCase()];
      return categoryInfo?.description || 'Browse our collection';
    }
    if (filters.blackFriday) return 'Up to 70% off on selected items!';
    if (filters.deals) return 'Amazing deals and discounts';
    if (filters.newArrival) return 'Fresh styles just landed';
    if (filters.featured) return 'Hand-picked favorites';
    return 'Discover our complete collection';
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} className="breadcrumb-link">
            <FaHome /> Home
          </span>
          <FaChevronRight className="breadcrumb-separator" />
          <span className="breadcrumb-current">
            {filters.category ? (CATEGORY_INFO[filters.category.toLowerCase()]?.name || filters.category) : 'Products'}
          </span>
        </div>

        {/* Page Header */}
        <div className="products-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">{getPageTitle()}</h1>
              <p className="page-description">{getPageDescription()}</p>
            </div>
            <p className="products-count">
              {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <form className="search-bar" onSubmit={handleSearch}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn-search">Search</button>
          </form>
        </div>

        {/* Filters Toggle Bar */}
        <div className="filters-toggle-bar">
          <button 
            className="btn-toggle-filters"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          <div className="sort-dropdown">
            <label>Sort by:</label>
            <select
              value={`${filters.sortBy}-${filters.order}`}
              onChange={(e) => {
                const [sortBy, order] = e.target.value.split('-');
                const newFilters = { ...filters, sortBy, order };
                setFilters(newFilters);
                updateSearchParams(newFilters);
              }}
            >
              <option value="created_at-DESC">Newest First</option>
              <option value="price-ASC">Price: Low to High</option>
              <option value="price-DESC">Price: High to Low</option>
              <option value="name-ASC">Name: A to Z</option>
              <option value="name-DESC">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Products Layout */}
        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Filters</h3>
              <button 
                className="btn-close-filters"
                onClick={() => setShowFilters(false)}
              >
                <FaTimes />
              </button>
            </div>

            {activeFilterCount > 0 && (
              <button className="btn-clear-filters" onClick={clearFilters}>
                Clear All Filters ({activeFilterCount})
              </button>
            )}

            {/* Categories Filter */}
            <div className="filter-group">
              <h4>Categories</h4>
              <div className="filter-options">
                {Object.entries(CATEGORY_INFO).map(([slug, info]) => (
                  <label key={slug} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === slug}
                      onChange={() => handleCategoryClick(slug)}
                    />
                    <span>{info.icon} {info.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Collections Filter */}
            <div className="filter-group">
              <h4>Collections</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.blackFriday}
                    onChange={(e) => handleFilterChange('blackFriday', e.target.checked)}
                  />
                  🔥 Black Friday Deals
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.deals}
                    onChange={(e) => handleFilterChange('deals', e.target.checked)}
                  />
                  💥 Deals & Offers
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.newArrival}
                    onChange={(e) => handleFilterChange('newArrival', e.target.checked)}
                  />
                  ✨ New Arrivals
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => handleFilterChange('featured', e.target.checked)}
                  />
                  ⭐ Featured
                </label>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="price-input"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="price-input"
                />
              </div>
            </div>
          </aside>

          {/* Products Content */}
          <div className="products-content">
            {products.length === 0 && !loading ? (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-reset">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
                loading={loading}
              >
                <div className="product-grid">
                  {products.map((product, index) => (
                    <div 
                      key={product.id}
                      className="product-grid-item"
                      style={{ animationDelay: `${(index % 20) * 0.05}s` }}
                    >
                      <ProductCard
                        product={product}
                        showDiscount={filters.blackFriday || filters.deals || product.black_friday_deal}
                        showNewBadge={filters.newArrival || product.is_new_arrival}
                      />
                    </div>
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>

      {/* Filters Overlay for Mobile */}
      {showFilters && (
        <div 
          className="filters-overlay"
          onClick={() => setShowFilters(false)}
        />
      )}
    </div>
  );
};

export default Products;