import React from 'react';
import Card from './Card';
import './PopUp.css'

const PopUp = ({ cards, onClose, selectIdx, setSelectIdx, showPopUp, forest }) => {//add a varible canSelect that determines if you can select cards (swamp forest vs view gy)
  if (!showPopUp) return null;
  let popUpText = null;
  if (forest) {
    popUpText = "Choose a Card to Revive"
  }
  return (
    <div className="pop-up-container">
      <button className="close-button" onClick={onClose}>X</button> {/* Close button */}
      {(popUpText) ? <b>{popUpText}</b> : null}
      {(forest) ?
        (cards.map((card, index) => {
          if (index == selectIdx) {
            return (
              <Card key={index} type={card.type}
                onClick={() => { setSelectIdx(index) }} selected={true} glowing={true} />
            );
          } else {
            return (
              <Card key={index} type={card.type}
                onClick={() => { setSelectIdx(index) }} glowing={true} />
            );
          }
        }))
        : cards.map((card, index) => (
          <Card key={index} type={card.type} />
        ))}
    </div>
  );

};

export default PopUp;