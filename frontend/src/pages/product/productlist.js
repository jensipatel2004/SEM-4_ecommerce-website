/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './productlist.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceRange, setPriceRange] = useState([]);
    const [showFilter, setShowFilter] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState(''); // 'asc' for ascending, 'desc' for descending
    const productsPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/product/products/');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/product/categories/');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleSearch = () => {
        if (searchQuery.trim() === '') {
            fetchProducts();
        } else {
            axios.get(`http://127.0.0.1:8000/product/products/?search=${searchQuery}`)
                .then(response => setProducts(response.data))
                .catch(error => console.log(error));
        }
        setCurrentPage(1);
    };

    const handlePriceChange = (value) => {
        if (priceRange.includes(value)) {
            setPriceRange(priceRange.filter(item => item !== value));
        } else {
            setPriceRange([...priceRange, value]);
        }
    };

    const filteredProducts = products.filter(product => {
        const inCategory = categoryFilter ? product.category === categoryFilter : true;
        const inPriceRange = priceRange.length === 0 || priceRange.some(range => {
            if (range === '10000') return product.selling_price < 10000;
            if (range === '20000') return product.selling_price >= 10000 && product.selling_price < 20000;
            if (range === '30000') return product.selling_price >= 20000 && product.selling_price < 30000;
            if (range === '100000') return product.selling_price >= 30000;
            return false;
        });
        return inCategory && inPriceRange;
    });

    // Sort filtered products based on sortOrder
    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.selling_price - b.selling_price;
        } else if (sortOrder === 'desc') {
            return b.selling_price - a.selling_price;
        }
        return 0; // No sorting
    });

    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleViewDetails = (productId) => {
        navigate(`/products/${productId}`);  // Updated to use navigate
    };

    return (
        <>
            <Navbar />
            
            <div className="product-page__header">
                <input
                    type="text"
                    placeholder="Search product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="product-page__filter-toggle" onClick={() => setShowFilter(!showFilter)}>
                    <FontAwesomeIcon icon={faFilter} /> {showFilter ? 'Hide Filter' : 'Show Filter'}
                </button>
            </div>
    
            <div className="product-page__content">
                {showFilter && (
                    <div className="product-page__filters">
                        <h4>Category</h4>
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <h4>Sort By Price</h4>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="">Default</option>
                            <option value="asc">Price: Low to High</option>
                            <option value="desc">Price: High to Low</option>
                        </select>

                        <h4>Max Price</h4>
                        <div className="price-ranges">
                            <label>
                                <input type="checkbox" checked={priceRange.includes('10000')} onChange={() => handlePriceChange('10000')} /> Below 10,000
                            </label>
                            <label>
                                <input type="checkbox" checked={priceRange.includes('20000')} onChange={() => handlePriceChange('20000')} /> 10,000 - 20,000
                            </label>
                            <label>
                                <input type="checkbox" checked={priceRange.includes('30000')} onChange={() => handlePriceChange('30000')} /> 20,000 - 30,000
                            </label>
                            <label>
                                <input type="checkbox" checked={priceRange.includes('100000')} onChange={() => handlePriceChange('100000')} /> Above 30,000
                            </label>
                        </div>
                    </div>
                )}
    
                <div className="product-page__list">
                    {currentProducts.length ? (
                        currentProducts.map(product => (
                            <div className="product-card" key={product.id} onClick={() => handleViewDetails(product.id)}>
                                <img src={`http://127.0.0.1:8000/media/${product.img}`} alt={product.name} />
                                <h3>{product.name}</h3>
                                <p>Original Price: {'\u20B9'} <span style={{ textDecoration: 'line-through'}}>{product.product_price}</span></p>
                                <p>Selling Price: {'\u20B9'} {product.selling_price}</p>
                                <p>
                                    Discount: {'\u20B9'} {(product.product_price - product.selling_price).toFixed(2)} ({((product.product_price - product.selling_price) / product.product_price * 100).toFixed(2)}%)
                                </p>
                            </div>
                        ))
                    ) : (
                        <h3 style={{ margin: '100px' }}>No products found</h3>
                    )}
                </div>
            </div>
    
            {/* Pagination Controls */}
            <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    {'<<'}
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
                    <button
                        key={pageNumber}
                        className={currentPage === pageNumber ? 'active' : ''}
                        onClick={() => handlePageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    {'>>'}
                </button>
            </div>
    
            <Footer />
        </>
    );
};

export default ProductList;
