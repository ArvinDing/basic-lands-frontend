import React, { useState } from 'react';
import Card from './Card';
import './PopUp.css'

const PopUp = ({ popUp, onClose, onConfirm, islandDisplay, setIslandDisplay }) => {//add a varible canSelect that determines if you can select cards (swamp forest vs view gy)
  const [selectIdx, setSelectIdx] = useState(-1);
  const [counterIdxs, setCounterIdxs] = useState([]);
  const showPopUp = popUp.enabled;
  const cards = popUp.cards;
  const type = popUp.type;
  if (!showPopUp) return null;

  const updateSelectIdx = (clickedIdx) => {
    if (clickedIdx === selectIdx) {
      setSelectIdx(-1);
    } else {
      setSelectIdx(clickedIdx);
    }
  }
  const updateCounterIdxs = (clickedIdx) => {
    //counterIdxs.length<=2
    let newCounterIdxs = counterIdxs.filter((item) => (item !== clickedIdx));
    if (newCounterIdxs.length !== counterIdxs.length) {
      //must have removed something
      setCounterIdxs(newCounterIdxs);
      return;
    }
    newCounterIdxs.push(clickedIdx);
    if (newCounterIdxs.length > 2) {
      newCounterIdxs = newCounterIdxs.slice(1);
    }
    setCounterIdxs(newCounterIdxs);
  }

  //the title of the popup
  let popUpText = null;
  if (type === "forest") {
    popUpText = "Choose A Card From Graveyard To Revive";
  } else if (type === "mountain") {
    popUpText = "Choose A Card From Enemy Field To Destroy";
  } else if (type === "swamp") {
    popUpText = "Choose A Card From Enemy Hand To Discard";
  } else if (type === "island") {
    popUpText = "Next 4 Cards. Rearrange And Discard To Liking";
  } else if (type === "graveyard") {
    popUpText = "Your Graveyard";
  } else if (type === "ograveyard") {
    popUpText = "Enemy Graveyard";
  } else if (type === "counter") {
    popUpText = `Counter ${popUp.counterType}?`;
  }

  const onIslandClick = (idx) => {
    if (selectIdx !== -1 && selectIdx !== idx) {
      let displaySelectIdx, displayIdx;
      let newIslandDisplay = islandDisplay.map((x, index) => {
        if (x.idx === selectIdx) {
          displaySelectIdx = index;
        } else if (x.idx === idx) {
          displayIdx = index;
        }
        return x;
      })
      newIslandDisplay[displaySelectIdx] = islandDisplay[displayIdx];
      newIslandDisplay[displayIdx] = islandDisplay[displaySelectIdx];
      setIslandDisplay(newIslandDisplay);
      updateSelectIdx(-1);
    } else {
      updateSelectIdx(idx);
    }
  }

  const onIslandRightClick = (idx) => {
    let newIslandDisplay = islandDisplay.map((info) => {
      if (info.idx === idx) {
        info.remove = !info.remove;
      }
      return info;
    });
    setIslandDisplay(newIslandDisplay);
  }
  //part for deciding what cardElements should do
  let cardElements;
  if (type === "swamp" || type === "mountain" || type === "forest") {
    cardElements = cards.map((card, index) => (
      <Card
        key={index}
        type={card.type}
        onClick={() => { updateSelectIdx(index) }}
        selected={index === selectIdx}
        glowing={true}
      />
    ));
  } else if (type === "island") {
    cardElements = []
    if (islandDisplay)
      for (const info of islandDisplay) {
        let idx = info.idx;
        let remove = info.remove;
        let card = cards[idx];
        cardElements.push(<Card
          key={idx}
          type={card.type}
          onClick={() => onIslandClick(idx)}
          onRightClick={() => onIslandRightClick(idx)}
          selected={idx === selectIdx}
          noSelectBorder
          glowing={true}
          removeB={remove}
        />);
      }
  } else if (type === "counter") {
    cardElements = cards.map((card, index) => (
      <Card
        key={index}
        type={card.type}
        onClick={() => { updateCounterIdxs(index) }}
        selected={counterIdxs.includes(index)}
        glowing={true}
      />
    ));
  } else {
    cardElements = cards.map((card, index) => (
      <Card key={index} type={card.type} />
    ));
  }

  const onConfirmClick = () => {
    if (onConfirm(selectIdx)) {
      onClose();
      setSelectIdx(-1);
    }
  }

  let closeButton = null;
  let confirmButton = null;
  if (type === "graveyard" || type === "ograveyard") {
    closeButton = <button className="close-button" onClick={onClose}>X</button>;
  } else {
    confirmButton = <div style={{ justifyContent: "center", display: "flex" }}>
      <button className="confirm-button" onClick={onConfirmClick}>Confirm!</button>
    </div>;
  }

  let title = null;
  if (popUpText) {
    title = <b>{popUpText}</b>;
  }

  const onYesClick = () => {
    if (onConfirm(counterIdxs)) {
      onClose();
      setCounterIdxs([]);
    }
  }

  const onNoClick = () => {
    if (onConfirm(counterIdxs)) {
      onClose();
      setCounterIdxs([]);
    }
  }
  let yesButton = null
  let noButton = null
  if (type === "counter") {
    yesButton = <div style={{ justifyContent: "center", display: "flex" }}>
      <button className="confirm-button" onClick={onYesClick}>Yes</button>
    </div>;
    noButton = <div style={{ justifyContent: "center", display: "flex" }}>
      <button className="confirm-button red-hover" onClick={onNoClick}>No</button>
    </div>;
  }
  //let counterPart= null
  let counterPart = <div style={{ display: 'flex', justifyContent: "center" }}>{yesButton}{noButton}</div>
  return (
    <div className="pop-up-container">
      <div className="pop-up-controls-container">
        {closeButton}
        {title}
      </div>
      <div className="pop-up-card-container">
        {cardElements}
      </div>
      {(type !== "counter") ?  confirmButton :counterPart}
    </div>
  );

};

export default PopUp;