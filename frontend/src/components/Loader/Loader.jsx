import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', fullScreen = false }) => {
  const loaderClass = `loader loader-${size}`;
  
  if (fullScreen) {
    return (
      <div className="loader-overlay">
        <div className={loaderClass}>
          <div className="loader-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={loaderClass}>
      <div className="loader-spinner"></div>
    </div>
  );
};

export default Loader;