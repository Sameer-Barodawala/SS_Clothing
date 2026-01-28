import React, { useRef, useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard from '../ProductCard/ProductCard';
import './ProductSlider.css';

const ProductSlider = ({ products, title, subtitle, showDiscount, showNewBadge }) => {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
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
            <button
              className={`slider-btn ${!canScrollLeft ? 'disabled' : ''}`}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
            >
              <FaChevronLeft />
            </button>
            <button
              className={`slider-btn ${!canScrollRight ? 'disabled' : ''}`}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      <div className="product-slider" ref={sliderRef}>
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

export default ProductSlider;