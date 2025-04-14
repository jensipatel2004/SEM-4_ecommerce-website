import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import img1 from './carosal1.jpeg'; // Ensure this path is correct
import img3 from './carosal3.jpeg'; // Ensure this path is correct
import img6 from './c3.png'; // Ensure this path is correct
import './Carousel.css'; // Import the CSS file where you put the custom styles

const Carousel = () => {
  return (
    <div style={{marginTop:'80px'}}>
    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
      {/* Indicators/dots */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      
      {/* The slideshow/carousel */}
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src={img3} alt="Slide 1" />
        </div>
        <div className="carousel-item">
          <img src={img6} alt="Slide 2" />
        </div>
        <div className="carousel-item">
          <img src={img1} alt="Slide 3" />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Carousel;
