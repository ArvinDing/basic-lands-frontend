import React from 'react';
import './Card.css'; // Import the CSS for styling the card

const cardTypes = {
  forest: { className: 'forest', label: 'Forest' },
  island: { className: 'island', label: 'Island' },
  mountain: { className: 'mountain', label: 'Mountain' },
  plains: { className: 'plains', label: 'Plains' },
  swamp: { className: 'swamp', label: 'Swamp' },
  unknown: { className: 'unknown', label: '?' },
};

const Card = ({ type, graveyard, hoverEffect, onClick, selected, deck }) => {
  const hoverEffectClass = hoverEffect ? 'hoverable' : '';
  const outlineClass = selected ? 'outlined' : '';
  const shiftupClass = selected ? 'shiftUp' : '';
  let style = {}
  if (graveyard) {
    style = {
      marginLeft: '-60px',
      width: '50px',
      height: '71px'
    }
  }

  if(deck){
    style = {
      marginLeft: '-117px'
    }
  }

  const cardTypeText = cardTypes[type] || { className: '', label: 'Default' };

  return (
    <div className={`card ${type} ${hoverEffectClass} ${outlineClass} ${shiftupClass}`} style={style}
      onClick={() => { if (onClick) { onClick() } }}>
      <b>{cardTypeText.label}</b>
    </div>
  );
};

export default Card;
