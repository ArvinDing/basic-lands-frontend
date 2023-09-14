import React from 'react';
import Card from './Card';
import './PopUp.css'

const PopUp = ({ cards, onClose, onConfirm, selectIdx, setSelectIdx, showPopUp, type }) => {//add a varible canSelect that determines if you can select cards (swamp forest vs view gy)
  if (!showPopUp) return null;
  let popUpText = null;
  if (type === "forest") {
    popUpText = "Choose a Card to Revive"
  } else if (type === "mountain") {
    popUpText = "Choose a Card to Destroy"
  } else if (type === "swamp") {
    popUpText = "Choose a Card to Discard"
  } else if (type === "island") {
    popUpText = "Rearrange and Discard to liking"
  }

  return (
    <div className="pop-up-container">
      <div className="pop-up-controls-container">
        <button className="close-button" onClick={onClose}>X</button> {/* Close button */}
        {(popUpText) ? <b>{popUpText}</b> : null}
      </div>
      <div className="pop-up-card-container">
        {(type !== "graveyard") ?
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
      {(type !== "graveyard") ?
        <div style={{ justifyContent: "center", display: "flex" }}>
          <button className="confirm-button" onClick={() => {
            onConfirm()
            onClose()
          }}>Confirm!</button> {/* Close button */}
        </div> : null
      }
    </div>
  );

};

export default PopUp;