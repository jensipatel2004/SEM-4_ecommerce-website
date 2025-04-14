import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import oip from '../images/OIP.jpeg';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';

const MyNavbar = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    const name = localStorage.getItem('user_name');
    setUserId(id);
    setUserName(name);

    if (id) {
      fetchCartCount(id);
    }
  }, []);

  const fetchCartCount = async (userId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/product/cart/count/${userId}`);
      const data = await response.json();
      setCartCount(data.count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    setUserId(null);
    setUserName('');
    setCartCount(0);
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Navbar.Brand href="/">
        <img src={oip} style={{ borderRadius: '50%', width: '50px', height: '50px' }} alt="Logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
          <Nav.Link href="/ContactUs">Contact</Nav.Link>
          <Nav.Link href="/productlist">Product</Nav.Link>
        </Nav>
        {userId ? (
          <div className="d-flex align-items-center">
            <div style={{ position: 'relative', marginRight: '16px' }}>
              <FaShoppingCart 
                style={{ fontSize: '1.5rem', cursor: 'pointer' }} 
                onClick={() => navigate('/cart')}
              />
              {cartCount > 0 && (
                <span className="cart-count" style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-10px',
                  background: 'red',
                  borderRadius: '50%',
                  color: 'white',
                  padding: '2px 5px',
                  fontSize: '0.8rem',
                }}>
                  {cartCount}
                </span>
              )}
            </div>
            <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => navigate('/profile')}>
              <FaUserCircle style={{ fontSize: '1.5rem', marginRight: '8px' }} />
              <span>{userName}</span>
            </div>
            <Button variant="outline-danger" className="ms-2" onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <Button variant="primary" onClick={() => navigate('/login')}>Login</Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default MyNavbar;
