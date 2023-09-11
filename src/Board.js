import React from 'react';
import Cards from './Cards.js'
import EndTurnButton from './EndTurnButton.js';

const Board = ({cards, endTurnButtonOnClick, isTurn}) => {
  const boardStyle = {
    width: '100%',
    height: '100vh',
    backgroundColor: '#89CFF0',
  };
  const lineStyle={
    width: '100%',
    top: '50%', // Position the line vertically in the middle
    borderBottom: '2px solid black', // Add a red line
    position: 'absolute',
    left: '0',
    right: '0',
  }
  return (
    <div style={boardStyle}>
        <div style={lineStyle}></div>
        <Cards cards={cards}/>
        <EndTurnButton onClick={endTurnButtonOnClick} isTurn={isTurn}/>
        {/* Content goes here */}
    </div>
  );
};

export default Board;
