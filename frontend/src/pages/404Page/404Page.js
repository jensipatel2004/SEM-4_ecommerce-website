// 404Page.js
import React from 'react';
import { Link } from 'react-router-dom';
import './404Page.css';  // Optional: You can create a CSS file for styling

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="home-link">Go to Home</Link>
        </div>
    );
};

export default NotFoundPage;
