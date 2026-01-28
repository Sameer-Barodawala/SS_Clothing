import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaUpload, FaTimes } from 'react-icons/fa';
import { productAPI } from '../../api/productAPI';
import { toast } from 'react-toastify';
import './Admin.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    sale_price: '',
    category_id: '1',
    brand: '',
    sizes: '',
    colors: '',
    stock: '',
    is_featured: false,
    is_new_arrival: false,
    black_friday_deal: false,
    black_friday_discount: 0
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts({ limit: 100 });
      setProducts(response.data.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // You'll need to add this to productAPI
        await productAPI.deleteProduct(id);
        toast.success('Product deleted');
        loadProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    
    // Parse JSON fields
    const sizes = typeof product.sizes === 'string' ? product.sizes : JSON.stringify(product.sizes);
    const colors = typeof product.colors === 'string' ? product.colors : JSON.stringify(product.colors);
    const images = typeof product.images === 'string' ? product.images : JSON.stringify(product.images);
    
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price || '',
      sale_price: product.sale_price || '',
      category_id: product.category_id || '1',
      brand: product.brand || '',
      sizes: sizes.replace(/[\[\]"]/g, '').split(',').join(', ') || '',
      colors: colors.replace(/[\[\]"]/g, '').split(',').join(', ') || '',
      stock: product.stock || '',
      is_featured: product.is_featured || false,
      is_new_arrival: product.is_new_arrival || false,
      black_friday_deal: product.black_friday_deal || false,
      black_friday_discount: product.black_friday_discount || 0
    });
    
    // Set existing images for preview
    try {
      const existingImages = JSON.parse(images);
      setImagePreview(existingImages);
    } catch (e) {
      setImagePreview([]);
    }
    
    setShowModal(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setUploadedImages(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const removeImage = (index) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);

    const newPreviews = [...imagePreview];
    newPreviews.splice(index, 1);
    setImagePreview(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare form data for multipart/form-data
      const submitData = new FormData();
      
      // Add all form fields
      submitData.append('name', formData.name);
      submitData.append('slug', formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'));
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('sale_price', formData.sale_price || '');
      submitData.append('category_id', formData.category_id);
      submitData.append('brand', formData.brand);
      submitData.append('stock', formData.stock);
      submitData.append('is_featured', formData.is_featured);
      submitData.append('is_new_arrival', formData.is_new_arrival);
      submitData.append('black_friday_deal', formData.black_friday_deal);
      submitData.append('black_friday_discount', formData.black_friday_discount);
      
      // Format sizes and colors as JSON arrays
      const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(s => s);
      const colorsArray = formData.colors.split(',').map(c => c.trim()).filter(c => c);
      submitData.append('sizes', JSON.stringify(sizesArray));
      submitData.append('colors', JSON.stringify(colorsArray));
      
      // Add images
      uploadedImages.forEach((file, index) => {
        submitData.append('images', file);
      });

      if (editingProduct) {
        await productAPI.updateProduct(editingProduct.id, submitData);
        toast.success('Product updated');
      } else {
        await productAPI.createProduct(submitData);
        toast.success('Product created');
      }
      
      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to save product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      sale_price: '',
      category_id: '1',
      brand: '',
      sizes: '',
      colors: '',
      stock: '',
      is_featured: false,
      is_new_arrival: false,
      black_friday_deal: false,
      black_friday_discount: 0
    });
    setUploadedImages([]);
    setImagePreview([]);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>Product Management</h1>
          <button 
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <FaPlus /> Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Products Table */}
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                let imageUrl = 'https://via.placeholder.com/50';
                try {
                  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
                  imageUrl = images[0] || imageUrl;
                } catch (e) {}
                
                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <img 
                        src={imageUrl} 
                        alt={product.name}
                        style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td className="product-name-cell">{product.name}</td>
                    <td>{product.brand}</td>
                    <td className="price">${product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className="product-badges">
                        {product.is_featured && <span className="badge featured">Featured</span>}
                        {product.is_new_arrival && <span className="badge new">New</span>}
                        {product.black_friday_deal && <span className="badge sale">Sale</span>}
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(product)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Product Form Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="product-form">
                {/* Image Upload Section */}
                <div className="form-section">
                  <h3>Product Images</h3>
                  <div className="image-upload-section">
                    <label className="upload-label">
                      <FaUpload />
                      <span>Upload Images (Max 5)</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    
                    {imagePreview.length > 0 && (
                      <div className="image-preview-grid">
                        {imagePreview.map((url, index) => (
                          <div key={index} className="image-preview-item">
                            <img src={url} alt={`Preview ${index + 1}`} />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeImage(index)}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="form-section">
                  <h3>Basic Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="e.g., Classic White T-Shirt"
                      />
                    </div>

                    <div className="form-group">
                      <label>Brand</label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        placeholder="e.g., Nike"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="4"
                      placeholder="Product description..."
                    />
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="form-section">
                  <h3>Pricing & Inventory</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                        placeholder="29.99"
                      />
                    </div>

                    <div className="form-group">
                      <label>Sale Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.sale_price}
                        onChange={(e) => setFormData({...formData, sale_price: e.target.value})}
                        placeholder="19.99"
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock *</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        required
                        placeholder="100"
                      />
                    </div>
                  </div>
                </div>

                {/* Variants */}
                <div className="form-section">
                  <h3>Variants</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Sizes (comma separated)</label>
                      <input
                        type="text"
                        value={formData.sizes}
                        onChange={(e) => setFormData({...formData, sizes: e.target.value})}
                        placeholder="S, M, L, XL"
                      />
                      <small>Example: S, M, L, XL, XXL</small>
                    </div>

                    <div className="form-group">
                      <label>Colors (comma separated)</label>
                      <input
                        type="text"
                        value={formData.colors}
                        onChange={(e) => setFormData({...formData, colors: e.target.value})}
                        placeholder="Black, White, Navy"
                      />
                      <small>Example: Black, White, Navy</small>
                    </div>
                  </div>
                </div>

                {/* Product Status */}
                <div className="form-section">
                  <h3>Product Status</h3>
                  <div className="form-checkboxes">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                      />
                      ⭐ Featured Product
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={formData.is_new_arrival}
                        onChange={(e) => setFormData({...formData, is_new_arrival: e.target.checked})}
                      />
                      ✨ New Arrival
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={formData.black_friday_deal}
                        onChange={(e) => setFormData({...formData, black_friday_deal: e.target.checked})}
                      />
                      🔥 Black Friday Deal
                    </label>
                  </div>

                  {formData.black_friday_deal && (
                    <div className="form-group">
                      <label>Discount Percentage</label>
                      <input
                        type="number"
                        value={formData.black_friday_discount}
                        onChange={(e) => setFormData({...formData, black_friday_discount: e.target.value})}
                        placeholder="30"
                      />
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {editingProduct ? 'Update' : 'Create'} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;