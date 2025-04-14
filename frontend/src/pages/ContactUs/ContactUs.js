import React, { useState, useEffect } from 'react';
import './ContactUs.css';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ContactUs = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [sellerList, setSellerList] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState('');
    const [message, setMessage] = useState('');

    // Auto-fetch user name from localStorage
    useEffect(() => {
        const storedUserName = localStorage.getItem('user_name');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    // Fetch seller list from backend
    useEffect(() => {
        fetch('http://127.0.0.1:8000/account/api/seller_list/')
            .then(response => response.json())
            .then(data => {
                setSellerList(data);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const contactData = {
            user_name: userName,
            user_email: email,
            seller_name: selectedSeller,
            msg: message,
        };

        fetch('http://127.0.0.1:8000/account/api/submit/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactData),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                setEmail('');
                setSelectedSeller('');
                setMessage('');
            });
    };

    return (
        <>
            <Navbar />
            <div className="contact-us">
                <h2>Contact Us</h2>
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input type="text" value={userName} required />

                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />

                    <label>Select Seller:</label>
                    <select 
                        value={selectedSeller} 
                        onChange={(e) => setSelectedSeller(e.target.value)} 
                        required
                    >
                        <option value="">Select a seller</option>
                        {sellerList.map(seller => (
                            <option key={seller.id} value={seller.name}>
                                {seller.name}
                            </option>
                        ))}
                    </select>

                    <label>Message:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>

                    <button type="submit">Submit</button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default ContactUs;
