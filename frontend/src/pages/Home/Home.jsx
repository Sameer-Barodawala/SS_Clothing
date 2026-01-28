import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaRocket } from 'react-icons/fa';
import { productAPI } from '../../api/productAPI';
import StockClearanceBanner from '../../components/BlackFridayBanner/BlackFridayBanner';
import ProductSlider from '../../components/ProductSlider/ProductSlider';
import AutoProductSlider from '../../components/ProductSlider/AutoProductSlider';
import './Home.css';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    loadInitialData();
    startCountdown();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [featuredRes, newRes, saleRes] = await Promise.all([
        productAPI.getFeatured(),
        productAPI.getNewArrivals(),
        productAPI.getBlackFridayDeals()
      ]);

      setFeatured(featuredRes.data.data);
      setNewArrivals(newRes.data.data);
      setSaleProducts(saleRes.data.data);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    const countdownDate = new Date();
    countdownDate.setHours(countdownDate.getHours() + 48); // 48 hours from now

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance > 0) {
        setCountdown({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  // Category data
  const categories = [
    {
      id: 1,
      name: 'T-Shirts',
      slug: 'tshirts',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      subtitle: 'Casual & Comfortable'
    },
    {
      id: 2,
      name: 'Shoes',
      slug: 'shoes',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
      subtitle: 'Step Up Your Style'
    },
    {
      id: 3,
      name: 'Pants',
      slug: 'pants',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=500&fit=crop',
      subtitle: 'Perfect Fit Guaranteed'
    },
    {
      id: 4,
      name: 'Shirts',
      slug: 'shirts',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop',
      subtitle: 'Classic & Modern'
    },
    {
      id: 5,
      name: 'Tops',
      slug: 'tops',
      image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=500&h=500&fit=crop',
      subtitle: 'Trendy Collection'
    },
    {
      id: 6,
      name: 'Accessories',
      slug: 'accessories',
      image: 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=500&h=500&fit=crop',
      subtitle: 'Complete Your Look'
    }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Stock Clearance Banner */}
      <StockClearanceBanner />

      <div className="container">
        {/* Sale/Clearance Products Slider */}
        {saleProducts.length > 0 && (
          <section className="section clearance-section">
            <ProductSlider
              products={saleProducts}
              title="🔥 Stock Clearance"
              subtitle="Limited time offers - grab them before they're gone!"
              showDiscount={true}
            />
          </section>
        )}

        {/* New Arrivals Slider */}
        {newArrivals.length > 0 && (
          <section className="section">
            <ProductSlider
              products={newArrivals}
              title="✨ New Arrivals"
              subtitle="Fresh styles just landed"
              showNewBadge={true}
            />
          </section>
        )}

        {/* Featured Products Slider - AUTO SCROLLING */}
        {featured.length > 0 && (
          <section className="section">
            <AutoProductSlider
              products={featured}
              title="⭐ Featured Products"
              subtitle="Hand-picked favorites - Auto scrolling"
              autoScroll={true}
            />
          </section>
        )}

        {/* Explore by Category */}
        <section className="section all-products-section">
          <div className="section-header-with-animation">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>
          
          <div className="category-grid">
            {categories.map((category, index) => (
              <Link 
                to={`/products?category=${category.slug}`} 
                key={category.id}
                className="category-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="category-card-bg"
                />
                <div className="category-card-content">
                  <h3 className="category-card-title">{category.name}</h3>
                  <p className="category-card-subtitle">{category.subtitle}</p>
                </div>
                <div className="category-card-arrow">
                  <FaArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* More Deals Coming Banner */}
        <section className="more-deals-banner">
          <div className="more-deals-content">
            <div className="more-deals-icon">
              <FaRocket />
            </div>
            <h2 className="more-deals-title">More Deals Coming Soon!</h2>
            <p className="more-deals-subtitle">
              Get ready for our biggest sale of the year
            </p>
            <div className="more-deals-timer">
              <div className="timer-box">
                <span className="timer-value">{String(countdown.hours).padStart(2, '0')}</span>
                <span className="timer-label">Hours</span>
              </div>
              <div className="timer-box">
                <span className="timer-value">{String(countdown.minutes).padStart(2, '0')}</span>
                <span className="timer-label">Minutes</span>
              </div>
              <div className="timer-box">
                <span className="timer-value">{String(countdown.seconds).padStart(2, '0')}</span>
                <span className="timer-label">Seconds</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;