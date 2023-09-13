import React from 'react';
import Card from './Card';
import './PopUp.css'

/*const PopUp = ({ cards }) => {
  return (
    <div className="pop-up-container">
      {cards.map((card, index) => (
        <Card key={index} type={card.type} />
      ))}
    </div> 
  );
};*/



const PopUp = ({ cards, onClose, showPopUp}) => {//add a varible canSelect that determines if you can select cards (swamp forest vs view gy)
    if (!showPopUp) return null;
    return (
        <div className="pop-up-container">
        <button className="close-button" onClick={onClose}>X</button> {/* Close button */}
        {cards.map((card, index) => (
            <Card key={index} type={card.type} />
        ))}
        </div>
    );
};

export default PopUp;