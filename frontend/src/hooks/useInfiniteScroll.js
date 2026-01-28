import { useState, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (fetchFunction, options = {}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const { limit = 20, filters = {} } = options;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetchFunction({
        page,
        limit,
        ...filters
      });

      const newItems = response.data.data.products;
      const pagination = response.data.data.pagination;

      setData(prev => [...prev, ...newItems]);
      setHasMore(pagination.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFunction, limit, filters]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  return { data, loading, hasMore, error, loadMore, reset };
};