// AboutUs.js
import React from 'react';
import './About.css'; // Ensure the path is correct based on your project structure
import aboutImage from './about.jpg';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const About = () => {
    return (
        <>
                    <Navbar />

        <section className="hero">
            <div className="heading">
                <h1>About Us</h1>
            </div>
            <div className="container">
                <div className="hero-content">
                    <h2>Welcome To Our Website</h2>
                    <p>Discover the latest trends and innovations in technology, design, and more. Our team of experts brings you the best content and insights to help you stay ahead of the curve.</p>
                    <button className="cta-button">Learn More</button>
                </div>
                <div className="hero-image">
                    <img src={aboutImage} alt="About Us" />
                </div>
            </div>
        </section>
        < Footer />

        </>
    );
};

export default About;
