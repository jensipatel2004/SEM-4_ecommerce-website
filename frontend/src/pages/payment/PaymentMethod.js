
import React, { useState } from "react";
import "./payment.css";
import img from '../../images/visa.png';
import { useNavigate } from "react-router-dom"; // Import useNavigate

function PaymentMethod() {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    monthYear: "",
    cvv: "",
  });

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const navigate = useNavigate(); // Initialize navigate

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const formattedValue = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
      setCardDetails({ ...cardDetails, [name]: formattedValue });
    } else if (name === "monthYear") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length > 2) {
        const month = formattedValue.slice(0, 2);
        const year = formattedValue.slice(2);
        
        // Ensure month does not exceed 12
        if (parseInt(month) > 12) {
          alert("Month cannot be greater than 12.");
          return;
        }
        
        setCardDetails({ ...cardDetails, [name]: `${month}/${year}` });
      } else {
        setCardDetails({ ...cardDetails, [name]: formattedValue });
      }
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const handlePersonalInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^[0-9]{10}$/; // Validate for a 10-digit phone number
    return re.test(String(phoneNumber));
  };

  const validateExpiryDate = (expiry) => {
    const [month, year] = expiry.split("/").map(Number);
    const today = new Date();
    const currentYear = today.getFullYear() % 100; // Get last two digits of the current year
    const currentMonth = today.getMonth() + 1; // Months are 0-indexed

    return !(year < currentYear || (year === currentYear && month < currentMonth));
  };

  const handlePay = async () => {
    if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Card number must be 16 digits.");
      return;
    }
    if (!validateExpiryDate(cardDetails.monthYear)) {
      alert("Expiry date must be greater than the current date.");
      return;
    }
    if (!validateEmail(personalInfo.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!validatePhoneNumber(personalInfo.phoneNumber)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    const userId = localStorage.getItem('user_id');

    // Fetch cart items for this user
    const response = await fetch(`http://127.0.0.1:8000/product/cart/items/${userId}`);
    const data = await response.json();
    const cartItems = data.items;
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.selling_price * item.quantity), 0); // Calculate total price

    const paymentData = {
      user_id: userId,
      cart_items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
      total_price: totalPrice,
    };

    try {
      const paymentResponse = await fetch('http://127.0.0.1:8000/product/checkout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (paymentResponse.ok) {
        const result = await paymentResponse.json();
        alert(result.message);
        // Navigate to home page after successful payment
        navigate('/'); // Use navigate to go to the home page
      } else {
        const errorResult = await paymentResponse.json();
        alert(`Payment failed: ${errorResult.error}`);
      }
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  return (
    <div className="App-payment">
      <div className="container">
        <div className="card-info">
          <h2>Card Information</h2>
          <p>Indicate details of the card from which money will be debited</p>
          <div className="card">
            <img src={img} alt="Visa Card" className="card-logo" />
            <div className="cardnumber">
              <label className="pay-label">Card Number</label>
              <input 
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardInputChange}
                placeholder="**** **** **** ****"
                maxLength="19" // Allow for spaces
              />
            </div>
            <div className="card-details">
              <div className="card-details2">
                <label className="pay-label">Expiry (MM/YY)</label>
                <input
                  type="text"
                  name="monthYear"
                  value={cardDetails.monthYear}
                  onChange={handleCardInputChange}
                  placeholder="MM/YY"
                  maxLength="5" // Format MM/YY
                />
              </div>
              <div className="card-details2">
                <label className="pay-label">CVV</label>
                <input
                  type="password"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  placeholder="***"
                  maxLength="3"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="personal-info">
          <h2>Personal Information</h2>
          <div className="personal-form">
            <div className="inline-input">
              <input
                type="text"
                name="firstName"
                value={personalInfo.firstName}
                onChange={handlePersonalInputChange}
                placeholder="First Name"
                required
              />
              <input
                type="text"
                name="lastName"
                value={personalInfo.lastName}
                onChange={handlePersonalInputChange}
                placeholder="Last Name"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              value={personalInfo.email}
              onChange={handlePersonalInputChange}
              placeholder="E-mail"
              required
            />
            <input
              type="tel"
              name="phoneNumber"
              value={personalInfo.phoneNumber}
              onChange={handlePersonalInputChange}
              placeholder="Phone Number"
              required
            />
          </div>
        </div>
      </div>
      <button className="pay-button" onClick={handlePay}>Pay Now</button>
    </div>
  );
}

export default PaymentMethod;
