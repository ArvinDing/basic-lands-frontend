import React, { useState } from 'react';
import Cards from './Cards.js'
import OppCards from './OppCards.js'
import EndTurnButton from './EndTurnButton.js';
import Graveyard from './Graveyard.js';
import Deck from './Deck.js'
import PopUp from './PopUp.js'

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
  let divElement = null

  const handleBoardClick = (event) => {
    if (event.target === divElement) {
      playCard()
    }
  };

  const [showPopUp, setShowPopUp] = useState(false);
  const onClose = () => {
    setShowPopUp(false);
  };

  const onOpen = () => {
    setShowPopUp(true);
  }

  return (
    <div style={boardStyle} ref={(div) => (divElement = div)} onClick={handleBoardClick}>
      <div style={lineStyle}></div>
      <Cards cards={cards} selectIdx={selectIdx} setSelectIdx={setSelectIdx} />
      <OppCards cards={oppCards} />
      <EndTurnButton onClick={endTurnButtonOnClick} isTurn={isTurn} />
      <Graveyard cards={cards} onClick = {onOpen}/>
      <Graveyard cards={cards} opponent onClick = {onOpen} />
      <Deck cardCnt={10} />
      <Deck cardCnt={10} opponent />
      <PopUp cards={cards} onClose = {onClose} showPopUp = {showPopUp} />
    </div>
  );
};

export default Board;
