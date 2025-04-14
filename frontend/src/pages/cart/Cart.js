/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Cart.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      fetchCartItems(userId);
    }
  }, []);

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/product/cart/items/${userId}`);
      const data = await response.json();
      setCartItems(data.items);
      setUserInfo(data.user);
      calculateTotalPrice(data.items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const calculateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + (parseFloat(item.product.selling_price) * item.quantity), 0);
    setTotalPrice(total);
  };

  const updateQuantity = async (itemId, quantity, maxStock) => {
    if (quantity > maxStock) {
      alert(`Cannot exceed available stock of ${maxStock}.`);
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/product/cart/update/${itemId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      if (response.ok) {
        fetchCartItems(localStorage.getItem('user_id'));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleQuantityChange = (itemId, quantity, maxStock) => {
    const parsedQuantity = parseInt(quantity);
    if (parsedQuantity < 1 || parsedQuantity > maxStock) {
      alert(`Please enter a quantity between 1 and ${maxStock}.`);
      return;
    }
    updateQuantity(itemId, parsedQuantity, maxStock);
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/product/cart/remove/${itemId}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCartItems(localStorage.getItem('user_id'));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const calculateGST = (total) => total * 0.18; // Assuming 18% GST
  const calculateFinalTotal = (total) => total + calculateGST(total);

  const finalTotal = calculateFinalTotal(totalPrice);

  const handleCheckout = () => {
    // Navigate to payment page with cartItems and totalPrice
    navigate('/payment', { state: { cartItems, totalPrice } });
  };

  return (
    <>
      <Navbar />

    
    <div className="cart-container">
      <div className="cart-left">
        <h2>Your Cart</h2>
        {cartItems.length > 0 ? (
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">
                <div className="item-details">
                  <img src={`http://127.0.0.1:8000/${item.product.img}`} alt={item.product.name} className="item-image" />
                  <div className="item-info">
                    <h3>{item.product.name}</h3>
                    <p>Price: {'\u20B9'}{parseFloat(item.product.selling_price).toFixed(2)}</p>
                    <p><strong>Available Stock:</strong> {item.product.stock}</p>
                    <label>
                      Quantity:
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        max={item.product.stock} // Set max to available stock
                        onChange={(e) => handleQuantityChange(item.id, e.target.value, item.product.stock)} 
                      />
                    </label>
                    <button className="remove-button" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      <div className="cart-right">
        <h2>Invoice</h2>
        <div className="invoice-details">
          <p><strong>User Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Mobile:</strong> {userInfo.mobile}</p>
          <p><strong>Address:</strong> {userInfo.address}</p>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => {
              const price = parseFloat(item.product.selling_price);
              const subtotal = (price * item.quantity).toFixed(2);
              return (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>{'\u20B9'}{price.toFixed(2)}</td>
                  <td>{'\u20B9'}{subtotal}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="invoice-totals">
          <p><strong>Total Price:</strong> {'\u20B9'}{totalPrice.toFixed(2)}</p>
          <p><strong>GST (18%):</strong> {'\u20B9'}{calculateGST(totalPrice).toFixed(2)}</p>
          <p><strong><u>Final Total:</u></strong> {'\u20B9'}{finalTotal.toFixed(2)}</p>
        </div>
        <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
    < Footer />

    </>
  );
};

export default Cart;
