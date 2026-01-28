import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlackFridayBanner.css';

const StockClearanceBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set Stock Clearance Sale end date - 7 days from now
    const saleEndDate = new Date();
    saleEndDate.setDate(saleEndDate.getDate() + 7);
    saleEndDate.setHours(23, 59, 59, 999);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = saleEndDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #000000 0%, #764ba2 100%)',
      padding: '60px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        opacity: 0.3
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900,
          color: 'white',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          🔥 STOCK CLEARANCE SALE
        </h1>
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          color: 'white',
          marginBottom: '30px',
          fontWeight: 600
        }}>
          Everything Must Go! Up to 80% OFF
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          {[
            { value: timeLeft.days, label: 'Days' },
            { value: timeLeft.hours, label: 'Hours' },
            { value: timeLeft.minutes, label: 'Minutes' },
            { value: timeLeft.seconds, label: 'Seconds' }
          ].map((item, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              padding: '20px',
              borderRadius: '12px',
              minWidth: '80px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{
                display: 'block',
                fontSize: '2rem',
                fontWeight: 900,
                color: 'white'
              }}>
                {String(item.value).padStart(2, '0')}
              </span>
              <span style={{
                display: 'block',
                fontSize: '0.875rem',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '5px'
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <button style={{
          display: 'inline-block',
          padding: '15px 50px',
          background: 'white',
          color: '#764ba2',
          border: 'none',
          fontWeight: 700,
          fontSize: '1.125rem',
          borderRadius: '50px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        }}>
          Shop Clearance Sale
        </button>

        <p style={{
          marginTop: '20px',
          color: 'white',
          fontSize: '0.875rem',
          fontStyle: 'italic'
        }}>
          ⚡ Limited Stock Available - First Come, First Served!
        </p>
      </div>
    </div>
  );
};

export default StockClearanceBanner;