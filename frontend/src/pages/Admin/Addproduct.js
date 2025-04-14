import React, { useState } from 'react';
import './Addproduct.css';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    distribution: '',
    product_price: '',
    selling_price: '',
    stock: '',
    category: '',
    brand: '',
  });
  const [image, setImage] = useState(null); // State for image
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Set the image file
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate selling price and product price
    if (parseFloat(formData.selling_price) > parseFloat(formData.product_price)) {
      setError('Selling price cannot be higher than product price.');
      return;
    }

    // Validate stock
    if (parseInt(formData.stock) < 0) {
      setError('Stock cannot be negative.');
      return;
    }

    if (!image) {
      setError('Product image is required.');
      return;
    }

    setError('');  // Clear previous errors

    // Get user_id from localStorage
    const user_id = localStorage.getItem('user_id');

    // Prepare data to send to the backend
    const productData = new FormData();  // Use FormData to handle file uploads
    productData.append('name', formData.name);
    productData.append('distribution', formData.distribution);
    productData.append('product_price', formData.product_price);
    productData.append('selling_price', formData.selling_price);
    productData.append('stock', formData.stock);
    productData.append('category', formData.category);
    productData.append('brand', formData.brand);
    productData.append('img', image);  // Append the image file
    productData.append('user_id', user_id);

    // Sending data using fetch (no Axios or serializer)
    fetch('http://localhost:8000/product/api/add-product/', {
      method: 'POST',
      body: productData,  // Send as FormData
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        setError(data.error);
      } else {
        setSuccessMessage('Product added successfully!');
        setError('');
        setFormData({
          name: '',
          distribution: '',
          product_price: '',
          selling_price: '',
          stock: '',
          category: '',
          brand: '',
        });
        setImage(null);  // Clear image
      }
    })
    .catch(error => {
      setError('Error adding product. Please try again.');
    });
  };

  return (
    <div className="add-product-form">
      <h2>Add Product</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Product Name"
          onChange={handleInputChange}
          required
        />
        <textarea
          name="distribution"
          value={formData.distribution}
          placeholder="Product Distribution"
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="product_price"
          value={formData.product_price}
          placeholder="Product Price"
          onChange={handleInputChange} 
          style={{width:'auto'}}          
          required
        />
        <input
          type="number"
          name="selling_price"
          value={formData.selling_price}
          placeholder="Selling Price"
          onChange={handleInputChange}
          style={{width:'auto'}}          
           
          required
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          placeholder="Stock Quantity"
          onChange={handleInputChange}
          style={{width:'auto'}}
          required
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          placeholder="Category"
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="brand"
          value={formData.brand}
          placeholder="Brand"
          onChange={handleInputChange}
          required
        />
        <input
          type="file"
          name="img"
          onChange={handleImageChange}
          required  // Image is compulsory
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
