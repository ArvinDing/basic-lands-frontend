// EndTurnButton.js
import React from 'react';
import './EndTurnButton.css';

const EndTurnButton = ({ onClick, isTurn }) => {
  return (
    <button className = "end-turn-button" onClick={onClick}>
      {isTurn? "End Turn":"Enemy Turn"}
    </button>
  );
};

export default EndTurnButton;
