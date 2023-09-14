import React from 'react';
import './Card.css'; // Import the CSS for styling the card

const Card = ({ type, graveyard, hoverEffect, onClick, selected, noSelectBorder,deck, glowing, hand, field, num, onRightClick, removeB}) => {
  const hoverEffectClass = hoverEffect ? 'hoverable' : '';
  const outlineClass = (selected && !noSelectBorder) ? 'outlined' : '';
  const shiftupClass = selected ? 'shiftUp' : '';
  const glowingClass = (glowing && !(selected&&!noSelectBorder) &&!removeB) ? 'glowing' : '';
  const removeBorderClass= (removeB)? 'removeBorder':'' 
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
  const handleContextMenu = (event) => {
    event.preventDefault();
    if(onRightClick)
      onRightClick();
  }
  // const cardTypeText = cardTypes[type] || { className: '', label: 'Default' };
  const numText = num ? "x" + num : '';
  return (
    <div className={`card ${type} ${hoverEffectClass} ${outlineClass} ${shiftupClass} ${glowingClass} ${removeBorderClass}`} style={style}
      onClick={() => { if (onClick) { onClick() } }} onContextMenu={handleContextMenu}>
      <b>{numText}</b>
    </div>
  );
};

export default Card;
