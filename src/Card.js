import React from 'react';
import './Card.css'; // Import the CSS for styling the card

const Card = ({ type }) => {
    const cardTypes = {
        forest: { className: 'forest', label: 'Forest' },
        island: { className: 'island', label: 'Island' },
        mountain: { className: 'mountain', label: 'Mountain' },
        plains: { className: 'plains', label: 'Plains' },
        swamp: { className: 'swamp', label: 'Swamp' },
        unknown: { className: 'unknown', label: '?' },
      };
 
    const cardTypeText = cardTypes[type] || { className: '', label: 'Default' };
    return (
        <div className={`card ${type}`}>
          <b>{cardTypeText.label}</b>
        </div>
      );
  
    
};

export default Card;
