import React, { useState, useEffect } from 'react';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/product/api/adminproducts/${userId}/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [userId]);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setFormData({});
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      selling_price: product.selling_price,
      stock: product.stock,
      distribution: product.distribution,
      category: product.category,
      brand: product.brand,
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/product/api/adminproducts/update/${selectedProduct.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      // Refresh the product list
      setProducts(products.map(product => product.id === selectedProduct.id ? { ...product, ...formData } : product));
      closeModal();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
  
  const handleRemove = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://localhost:8000/product/api/adminproducts/delete/${productId}/`, {
          method:'Delete',
          headers: {
            'Content-Type': 'application/json',
          },
          
        });
        if (!response.ok) {
          throw new Error('Failed to delete product');
        }
        // Remove the product from the state
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div>
      <h2>Your Products</h2>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Selling Price</th>
            <th>Quantity</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td><img src={`http://127.0.0.1:8000/media/${product.img}`} alt={product.name}  style={{height:'100px', width:'100px'}}/></td>
              <td>{product.name}</td>
              <td>{'\u20B9'}{product.selling_price}</td>
              <td>{product.stock}</td>
              <td>
                <button onClick={() => handleViewDetails(product)} >View Details</button>
              </td>
              <td>
                <button onClick={() => handleEdit(product)} >Edit</button>
              </td>
              <td>
                <button onClick={() => handleRemove(product.id)} style={{backgroundColor: 'red', color: 'white'}}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={closeModal}>&times;</span>
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <h2>Edit Product</h2>
                
                <label>Name: <input type="text" name="name" value={formData.name} onChange={handleChange} /></label>
                <label>Selling Price: <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} /></label>
                <label>Stock: <input type="number" name="stock" value={formData.stock} onChange={handleChange} /></label>
                <label>Distribution: <input type="text" name="distribution" value={formData.distribution} onChange={handleChange} /></label>
                <label>Category: <input type="text" name="category" value={formData.category} onChange={handleChange} /></label>
                <label>Brand: <input type="text" name="brand" value={formData.brand} onChange={handleChange} /></label>
                <button type="submit">Update Product</button>
              </form>
            ) : (
              <div>
                <h2>Product Details</h2>
                <img src={`http://127.0.0.1:8000/media/${selectedProduct.img}`} alt={selectedProduct.name} />
                <h3>{selectedProduct.name}</h3>
                <p><strong>Price:</strong> {'\u20B9'}{selectedProduct.selling_price}</p>
                <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                <p><strong>Distribution:</strong> {selectedProduct.distribution}</p>
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                <button onClick={closeModal}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
