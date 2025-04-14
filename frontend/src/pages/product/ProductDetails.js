import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/product/products/${productId}/`);
                const data = await response.json();
                setProduct(data);
                setMainImage(data.img);

                const relatedResponse = await fetch(`http://127.0.0.1:8000/product/products?category=${data.category}`);
                const relatedData = await relatedResponse.json();
                setRelatedProducts(relatedData);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
    }, [productId]);

    const handleAddToCart = async () => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            alert('You need to log in to add items to your cart.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/product/cart/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, productId, quantity }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                window.location.reload(); // Refresh the cart page
            } else {
                alert(result.error || 'Failed to add to cart. Please try again.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart. Please try again.');
        }
    };

    const handleBuyNow = () => {
        navigate(`/payment`); // Redirect to the payment page
    };

    const handleThumbnailClick = (img) => {
        setMainImage(img);
    };

    const handleViewDetails = (relatedProductId) => {
        navigate(`/products/${relatedProductId}`);
    };

    if (!product) return <p>Loading...</p>;

    const actualPrice = parseFloat(product.product_price);
    const sellingPrice = parseFloat(product.selling_price);
    const discountAmount = actualPrice - sellingPrice;

    return (
        <>
            <Navbar />
            <div className="product-details">
                <div className="product-image-section">
                    <img src={`http://127.0.0.1:8000/${mainImage}`} alt={product.name} className="main-image" />
                    <div className="thumbnail-images">
                        {product.additional_images && product.additional_images.map((img, index) => (
                            <img
                                key={index}
                                src={`http://127.0.0.1:8000/${img}`}
                                alt={`Thumbnail ${index}`}
                                onClick={() => handleThumbnailClick(img)}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-info">
                    <h2>{product.name}</h2>
                    <p className="distribution">Distribution: {product.distribution}</p>
                    <p className="discount">
                        Discount: <span className="discount-amount">{'\u20B9'} {discountAmount.toFixed(2)}</span>
                    </p>
                    <p className="price">
                        Price:
                        <span className="product-price">{'\u20B9'}{actualPrice.toFixed(2)}</span>
                        <span className="selling-price">{'\u20B9'}{sellingPrice.toFixed(2)}</span>
                    </p>
                    <p>Stock: {product.stock}</p>

                    <label htmlFor="quantity-select">Select Quantity:</label>
                    <select
                        id="quantity-select"
                        className="quantity-select"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, e.target.value)))}
                    >
                        {[...Array(product.stock).keys()].map((x) => (
                            <option key={x} value={x + 1}>{x + 1}</option>
                        ))}
                    </select>

                    <div className="button-group">
                        <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
                        <button className="buy-now-button" onClick={handleBuyNow}>Buy Now</button>
                    </div>

                    <p>{product.description}</p>
                    <div className="seller-info">
                        <h3>Seller Information</h3>
                        <p>Name: {product.seller?.name || 'Not provided'}</p>
                        <p>Email: {product.seller?.email || 'Not provided'}</p>
                        <p>Mobile: {product.seller?.mobile || 'Not provided'}</p>
                        <p>Address: {product.seller?.address || 'Not provided'}</p>
                    </div>
                </div>
            </div>
            <div className="related-products">
                <h3>Related Products</h3>
                <div className="related-products-list">
                    {relatedProducts.map((relatedProduct) => (
                        <div key={relatedProduct.id} className="related-product-item" onClick={() => handleViewDetails(relatedProduct.id)}>
                            <img src={`http://127.0.0.1:8000/media/${relatedProduct.img}`} alt={relatedProduct.name} />
                            <p>{relatedProduct.name}</p>
                            <p>{'\u20B9'}{parseFloat(relatedProduct.selling_price).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProductDetails;
