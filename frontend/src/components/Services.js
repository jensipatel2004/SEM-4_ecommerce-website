import React from 'react';
import './Services.css'; // Ensure to create this CSS file
import img1 from '../images/service-1.png'
import img2 from '../images/service-2.png'
import img3 from '../images/service-3.png'
import img4 from '../images/service-4.png'
const Services = () => {
  const services = [
    {
      title: "Free Shipping",
      text: "All orders over ₹ 9,999.00",
      icon: img1,
    },
    {
      title: "Quick Payment",
      text: "100% secure payment",
      icon: img2,
    },
    {
      title: "Free Returns",
      text: "Money back in 30 days",
      icon: img3,
    },
    {
      title: "24/7 Support",
      text: "Get Quick Support",
      icon: img4,
    },
  ];

  return (
    <div className="homepage-info">
      <ul className="service-list">
        {services.map((service, index) => (
          <li key={index} className="service-item">
            <div className="service-card">
              <div className="card-icon">
                <img src={service.icon} width="53" height="28" alt={`${service.title} icon`} />
              </div>
              <div>
                <h3 className="h4 card-title">{service.title}</h3>
                <p className="card-text">{service.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
