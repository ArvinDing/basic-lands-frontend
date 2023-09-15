import React from 'react';
import Card from './Card';
import './PopUp.css'

const PopUp = ({ cards, onClose, onConfirm, selectIdx, setSelectIdx, islandDisplay, setIslandDisplay, showPopUp, type }) => {//add a varible canSelect that determines if you can select cards (swamp forest vs view gy)
  if (!showPopUp) return null;
  let popUpText = null;
  if (type === "forest") {
    popUpText = "Choose A Card From Graveyard To Revive"
  } else if (type === "mountain") {
    popUpText = "Choose A Card From Enemy Field To Destroy"
  } else if (type === "swamp") {
    popUpText = "Choose A Card From Enemy Hand To Discard"
  } else if (type === "island") {
    popUpText = "Next 4 Cards. Rearrange And Discard To Liking"
  } else if (type === "graveyard") {
    popUpText = "Your Graveyard"
  } else if (type === "ograveyard") {
    popUpText = "Enemy Graveyard"
  } else if (type === "countering") {
    popUpText = "Counter?"
  }

  let cardElements;
  if (type === "swamp" || type === "mountain" || type === "forest") {
    cardElements = cards.map((card, index) => (
      <Card
        key={index}
        type={card.type}
        onClick={() => { setSelectIdx(index) }}
        selected={index === selectIdx}
        glowing={true}
      />
    ));
  } else if (type === "island") {
    cardElements = []
    for (const info of islandDisplay) {
      let idx = info.idx
      let remove = info.remove
      let card = cards[idx]
      cardElements.push(<Card
        key={idx}
        type={card.type}
        onClick={() => {
          if (selectIdx !== -1 && selectIdx !== idx) {
            let displaySelectIdx, displayIdx
            let newIslandDisplay = islandDisplay.map((x, index) => {
              if (x.idx === selectIdx) {
                displaySelectIdx = index
              } else if (x.idx === idx) {
                displayIdx = index
              }
              return x
            })
            newIslandDisplay[displaySelectIdx] = islandDisplay[displayIdx]
            newIslandDisplay[displayIdx] = islandDisplay[displaySelectIdx]
            setIslandDisplay(newIslandDisplay)
            setSelectIdx(-1)
          } else {
            setSelectIdx(idx)
          }
        }}
        onRightClick={() => {
          let newIslandDisplay = islandDisplay.map((info) => {
            if (info.idx === idx) {
              info.remove = !info.remove
            }
            return info
          })
          setIslandDisplay(newIslandDisplay)
        }}
        selected={idx === selectIdx}
        noSelectBorder
        glowing={true}
        removeB={remove}
      />)
    }
  } else {
    cardElements = cards.map((card, index) => (
      <Card key={index} type={card.type} />
    ));
  }

  return (
    <div className="pop-up-container">
      <div className="pop-up-controls-container">
        {(type === "graveyard" || type === "ograveyard") && <button className="close-button" onClick={onClose}>X</button>}
        {(popUpText) ? <b>{popUpText}</b> : null}
      </div>
      <div className="pop-up-card-container">
        {cardElements}
      </div>
      {(type !== "graveyard" && type !== "ograveyard") ?
        <div style={{ justifyContent: "center", display: "flex" }}>
          <button className="confirm-button" onClick={() => {
            if (onConfirm())
              onClose()
          }}>Confirm!</button> {/* Close button */}
        </div> : null
      }
    </div>
  );

};

export default PopUp;