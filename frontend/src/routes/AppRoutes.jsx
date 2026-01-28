import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy load components
const Home = lazy(() => import('../pages/Home/Home'));
const Products = lazy(() => import('../pages/Products/Products'));
const ProductDetails = lazy(() => import('../pages/ProductDetails/ProductDetails'));
const Cart = lazy(() => import('../pages/Cart/Cart'));
const Checkout = lazy(() => import('../pages/Checkout/Checkout'));
const Login = lazy(() => import('../pages/Login/Login'));
const Register = lazy(() => import('../pages/Register/Register'));

// Admin pages
const Dashboard = lazy(() => import('../pages/Admin/Dashboard'));
const OrderManagement = lazy(() => import('../pages/Admin/OrderManagement'));
const ProductManagement = lazy(() => import('../pages/Admin/ProductManagement'));

// Loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh'
  }}>
    <div className="spinner"></div>
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute adminOnly>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute adminOnly>
              <OrderManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/products" 
          element={
            <ProtectedRoute adminOnly>
              <ProductManagement />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;