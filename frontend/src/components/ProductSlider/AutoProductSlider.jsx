import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from 'react-icons/fa';
import ProductCard from '../ProductCard/ProductCard';
import './ProductSlider.css';

const AutoProductSlider = ({ products, title, subtitle, showDiscount, showNewBadge, autoScroll = false }) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollIntervalRef = useRef(null);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScroll);
      return () => slider.removeEventListener('scroll', checkScroll);
    }
  }, [products]);

  // Auto scroll effect
  useEffect(() => {
    if (autoScroll && !isPaused && sliderRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        if (sliderRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
          
          // If reached end, reset to beginning
          if (scrollLeft >= scrollWidth - clientWidth - 10) {
            sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll by 2 pixels for smooth continuous movement
            sliderRef.current.scrollBy({ left: 2, behavior: 'auto' });
          }
        }
      }, 30); // Adjust speed here (lower = faster)

      return () => {
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
        }
      };
    }
  }, [autoScroll, isPaused, products]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="product-slider-container">
      {title && (
        <div className="slider-header">
          <div className="slider-title-section">
            <h2 className="slider-title">{title}</h2>
            {subtitle && <p className="slider-subtitle">{subtitle}</p>}
          </div>
          <div className="slider-controls">
            {autoScroll && (
              <button
                className="slider-btn"
                onClick={togglePause}
                title={isPaused ? 'Play' : 'Pause'}
              >
                {isPaused ? <FaPlay /> : <FaPause />}
              </button>
            )}
            
            
          </div>
        </div>
      )}

      <div 
        className="product-slider" 
        ref={sliderRef}
        onMouseEnter={() => autoScroll && setIsPaused(true)}
        onMouseLeave={() => autoScroll && setIsPaused(false)}
      >
        {products.map((product, index) => (
          <div key={product.id} className="slider-item" style={{ animationDelay: `${index * 0.1}s` }}>
            <ProductCard
              product={product}
              showDiscount={showDiscount}
              showNewBadge={showNewBadge}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutoProductSlider;