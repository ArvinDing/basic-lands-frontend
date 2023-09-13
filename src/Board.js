import React from 'react';
import Cards from './Cards.js'
import OppCards from './OppCards.js'
import EndTurnButton from './EndTurnButton.js';
import Graveyard from './Graveyard.js';
import Deck from './Deck.js'
import Field from './Field.js'

const Board = ({ cards, playCard, selectIdx, setSelectIdx, oppCards, endTurnButtonOnClick, isTurn }) => {
  const boardStyle = {
    width: '100%',
    height: '100vh',
    backgroundColor: 'rbg(200,200,200)',
  };

  const lineStyle = {
    width: '100%',
    top: '50%', // Position the line vertically in the middle
    borderBottom: '5px solid black', // Add a red line
    position: 'absolute',
    left: '0',
    right: '0',
  }
  let boardRef = null
  let fieldRef = null

  const handleBoardClick = (event) => {
    if (event.target === boardRef ) {
      playCard()
    }
  };

  return (
    <div style={boardStyle} ref={(div) => (boardRef = div)} onClick={handleBoardClick}>
      <div style={lineStyle}></div>
      <Cards cards={cards} selectIdx={selectIdx} setSelectIdx={setSelectIdx} isTurn={isTurn} />
      <OppCards cards={oppCards} />
      <EndTurnButton onClick={endTurnButtonOnClick} isTurn={isTurn} />
      <Graveyard cards={cards} />
      <Graveyard cards={cards} opponent />
      <Field playCard={playCard} cards={cards} />
      <Field playCard={playCard} cards={cards} enemy/>
      <Deck cardCnt={10} />
      <Deck cardCnt={10} opponent />
    </div>
  );
};

export default Board;
