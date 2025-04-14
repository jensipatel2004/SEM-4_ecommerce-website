import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import './Home.css'; // Ensure correct path
import Navbar from './Navbar'; // Assuming you have a Navbar component
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Services from './Services';
const Home = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/product/products/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
        setDisplayedProducts(data.slice(0, 3)); // Show first three products initially
      } catch (err) {
        setError('Error fetching products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleExploreMore = () => {
    navigate(`/productlist`); // Navigate to the product list page
  };

  const handleNext = () => {
    if (currentIndex < products.length - 3) {
      setCurrentIndex(currentIndex + 1);
      setDisplayedProducts(products.slice(currentIndex + 1, currentIndex + 4));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDisplayedProducts(products.slice(currentIndex - 1, currentIndex + 2));
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`); // Navigate to the product details page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      <Carousel />
      <div className="homepage">
        {/* Featured Products */}
        <div className="product-section">
          <h2>Products</h2>
          <div className="product-list">
            {displayedProducts.map((product) => (
              <div key={product.id} className="product-item" onClick={() => handleProductClick(product.id)}>
                <img src={`http://127.0.0.1:8000/media/${product.img}`} alt={product.name} className="product-img" />
                <h3 className="product-name">{product.name}</h3>
              </div>
            ))}
          </div>
          <div className="navigation-buttons">
            <button className="button" onClick={handlePrevious} disabled={currentIndex === 0}>
              &lt; {/* Left arrow */}
            </button>
            <button className="button" onClick={handleNext} disabled={currentIndex >= products.length - 3}>
              &gt; {/* Right arrow */}
            </button>
          </div>
          <div className="explore-more" onClick={handleExploreMore}>
            Explore More
          </div>
        </div>
      </div>
      <Services/>
      <Footer />
    </>
  );
};

export default Home;
