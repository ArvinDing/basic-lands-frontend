import React from 'react';
import Hand from './Hand.js'
import OppHand from './OppHand.js'
import EndTurnButton from './EndTurnButton.js';
import Graveyard from './Graveyard.js';
import Deck from './Deck.js'
import PopUp from './PopUp.js'
import Field from './Field.js'

const Board = ({ state, handSelectIdx, setHandSelectIdx, placeCard, endTurnButtonOnClick, popUp, setPopUp, onConfirm, islandDisplay, setIslandDisplay }) => {
  const hand = state.hand
  const isTurn = state.isTurn
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

  const handleBoardClick = (event) => {
    if (event.target === boardRef) {
      placeCard()
    }
  };


  const onClose = () => {
    setPopUp({ enabled: false });
  };

  const openGraveyard = () => {
    if (popUp.enabled)
      return;
    setPopUp({ enabled: true, cards: state.graveyard, type: "graveyard" });
  }

  const openOppGraveyard = () => {
    if (popUp.enabled)
      setPopUp({ enabled: true, cards: state.oppGraveyard, type: "ograveyard" });
  }

  return (
    <div style={boardStyle} ref={(div) => (boardRef = div)} onClick={handleBoardClick}>
      <div style={lineStyle}></div>
      <Hand cards={hand} selectIdx={handSelectIdx} setSelectIdx={setHandSelectIdx} isTurn={isTurn} />
      <OppHand cards={state.oppHand} />
      <EndTurnButton onClick={endTurnButtonOnClick} isTurn={isTurn} />
      <Graveyard cards={state.oppGraveyard} opponent onClick={openOppGraveyard} />
      <Graveyard cards={state.graveyard} onClick={openGraveyard} />
      <Field onClick={placeCard} cards={state.field} />
      <Field onClick={placeCard} cards={state.oppField} enemy />
      <Deck cardCnt={state.deckCnt} />
      <Deck cardCnt={state.oppDeckCnt} opponent />
      <PopUp popUp={popUp} onConfirm={onConfirm} onClose={onClose}
        islandDisplay={islandDisplay} setIslandDisplay={setIslandDisplay} />
    </div>
  );
};

export default Board;
