// EndTurnButton.js
import React from 'react';
import './EndTurnButton.css';

const EndTurnButton = ({ onClick, isTurn }) => {
  if(isTurn){
    return (
      <button className="end-turn-button hover-button" onClick={onClick}>
        End Turn
      </button>
    );
  }

  return (
    <button className="end-turn-button" onClick={onClick} disabled>
      Enemy Turn
    </button>
  );
};

export default EndTurnButton;
