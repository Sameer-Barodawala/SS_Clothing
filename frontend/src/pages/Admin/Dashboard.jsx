import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaUsers, 
  FaDollarSign, 
  FaChartLine,
  FaBox,
  FaClipboardList
} from 'react-icons/fa';
import { productAPI } from '../../api/productAPI';
import { orderAPI } from '../../api/orderAPI';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have a dedicated admin API endpoint
      const ordersRes = await orderAPI.getOrders();
      const productsRes = await productAPI.getProducts({ limit: 100 });

      const orders = ordersRes.data.data;
      const products = productsRes.data.data.products;

      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0),
        totalProducts: products.length,
        totalCustomers: new Set(orders.map(o => o.user_id)).size
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your e-commerce store</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon revenue">
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Revenue</p>
              <h3 className="stat-value">${stats.totalRevenue.toFixed(2)}</h3>
              <span className="stat-change positive">+12.5% from last month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders">
              <FaShoppingBag />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Orders</p>
              <h3 className="stat-value">{stats.totalOrders}</h3>
              <span className="stat-change positive">+8.2% from last month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon products">
              <FaBox />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Products</p>
              <h3 className="stat-value">{stats.totalProducts}</h3>
              <span className="stat-change">Updated today</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon customers">
              <FaUsers />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Customers</p>
              <h3 className="stat-value">{stats.totalCustomers}</h3>
              <span className="stat-change positive">+15 new this month</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products/new" className="action-card">
              <FaBox />
              <span>Add New Product</span>
            </Link>
            <Link to="/admin/products" className="action-card">
              <FaClipboardList />
              <span>Manage Products</span>
            </Link>
            <Link to="/admin/orders" className="action-card">
              <FaShoppingBag />
              <span>View Orders</span>
            </Link>
            <Link to="/admin/analytics" className="action-card">
              <FaChartLine />
              <span>Analytics</span>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="view-all">View All</Link>
          </div>
          
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">#{order.order_number}</td>
                    <td>Customer #{order.user_id}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="amount">${order.total_amount}</td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders/${order.id}`} className="btn-view">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;