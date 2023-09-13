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

const Card = ({ type, graveyard, hoverEffect, onClick, selected, deck, glowing, hand, field , num}) => {
  const hoverEffectClass = hoverEffect ? 'hoverable' : '';
  const outlineClass = selected ? 'outlined' : '';
  const shiftupClass = selected ? 'shiftUp' : '';
  const glowingClass = (glowing && !selected) ? 'glowing' : '';

  let style = {}
  if (graveyard) {
    style = {
      marginLeft: '-60px',
      width: '50px',
      height: '71px'
    }
  } else if (deck) {
    style = {
      marginLeft: '-97px'
    }
  } else if (hand) {
    style = {
      marginLeft: '-20px'
    }
  } else if (field) {
    style = {
      margin: '5px'
    }
  }

  // const cardTypeText = cardTypes[type] || { className: '', label: 'Default' };
  const numText = num ? "x" + num : '';
  return (
    <div className={`card ${type} ${hoverEffectClass} ${outlineClass} ${shiftupClass} ${glowingClass}`} style={style}
      onClick={() => { if (onClick) { onClick() } }}>
      <b>{numText}</b>
    </div>
  );
};

export default Card;
