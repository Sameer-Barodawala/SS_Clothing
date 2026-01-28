import api from './axios';

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getCategories: () => api.get('/categories'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getBlackFridayDeals: () => api.get('/products/black-friday'),

   createProduct: (formData) => api.post('/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  updateProduct: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};
