// src/components/TeamCarousel.js
import React, { useState } from 'react';
import teamMembers from './teamMembers'; // Ensure you have a data file for team members

const TeamCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      (prevIndex - 1 + teamMembers.length) % teamMembers.length
    );
  };

  return (
    <div className="team-carousel">
      <div className="team-member">
        <img src={teamMembers[activeIndex].image} alt={teamMembers[activeIndex].name} />
        <h3>{teamMembers[activeIndex].name}</h3>
        <p>{teamMembers[activeIndex].role}</p>
      </div>
      <button onClick={handlePrev}>&lt;</button>
      <button onClick={handleNext}>&gt;</button>
    </div>
  );
};

export default TeamCarousel;
