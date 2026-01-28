import React, { useEffect, useRef } from 'react';
import './InfiniteScroll.css';

const InfiniteScroll = ({ children, loadMore, hasMore, loading }) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, loading]);

  return (
    <div className="infinite-scroll">
      {children}
      {hasMore && (
        <div ref={loaderRef} className="infinite-scroll-loader">
          {loading && (
            <div className="loader-spinner">
              <div className="spinner"></div>
              <p>Loading more products...</p>
            </div>
          )}
        </div>
      )}
      {!hasMore && (
        <div className="infinite-scroll-end">
          <p>You've reached the end!</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
