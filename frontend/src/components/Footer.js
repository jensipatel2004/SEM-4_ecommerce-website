import React from 'react';
import './Footer.css'; // Assuming you'll style it in a CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Div - About Us */}
        <div className="footer-section about">
          <h2>Online Shopping Hub</h2>
          <p>
            We are a leading e-commerce platform dedicated to providing the best shopping experience. 
            Discover a wide range of products at unbeatable prices, all from the comfort of your home.
          </p>
        </div>

        {/* Middle Div - Customer Support */}
        <div className="footer-section contact">
          <h2>Customer Support</h2>
          <p>Phone: +91 9090909090</p>
          <p>Email: support@onlineshoppinghub.com</p>
        </div>

        {/* Right Div - Important Links */}
        <div className="footer-section links">
          <h2>Important Links</h2>
          <ul>
            <li><a href="http://localhost:3000/">Home</a></li>
            <li><a href="http://localhost:3000/productlist">Shop Now</a></li>
            <li><a href="http://localhost:3000/aboutus">About Us</a></li>
            <li><a href="http://localhost:3000/ContactUs">Contact Us</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
