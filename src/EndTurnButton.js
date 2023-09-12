// EndTurnButton.js
import React from 'react';
import './EndTurnButton.css';

const EndTurnButton = ({ onClick, isTurn }) => {
  let hoverClass = isTurn ? 'hoverChange' : '';
  let text = isTurn ? 'End Turn' : 'Enemy Turn';
  return (
    <button className={`end-turn-button ${hoverClass}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default EndTurnButton;
