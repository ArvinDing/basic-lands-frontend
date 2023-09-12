import React from 'react';
import './Card.css'; // Import the CSS for styling the card

const Card = ({ type, style, hoverEffect, onClick, selected }) => {
  const cardTypes = {
    forest: { className: 'forest', label: 'Forest' },
    island: { className: 'island', label: 'Island' },
    mountain: { className: 'mountain', label: 'Mountain' },
    plains: { className: 'plains', label: 'Plains' },
    swamp: { className: 'swamp', label: 'Swamp' },
    unknown: { className: 'unknown', label: '?' },
  };

  const hoverEffectClass = hoverEffect ? 'hoverable' : '';
  const outlineClass = selected ? 'outlined' : '';
  const shiftupClass = selected ? 'shiftUp' : '';

  const cardTypeText = cardTypes[type] || { className: '', label: 'Default' };

  return (
    <div className={`card ${type} ${hoverEffectClass} ${outlineClass} ${shiftupClass}`} style={style}
      onClick={() => { if (onClick) { onClick() } }}>
      <b>{cardTypeText.label}</b>
    </div>
  );
};

export default Card;
