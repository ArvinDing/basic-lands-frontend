// Cards.js
import React from 'react';
import Card from './Card';
import './Cards.css'

const Cards = ({ cards, selectIdx, setSelectIdx }) => {
  return (
    <div className="cards-container">
      {cards.map((card, index) => {
        if (index == selectIdx) {
          return (
            <Card key={index} type={card.type} hoverEffect={true} onClick={() => setSelectIdx(index)} selected={true} />
          );
        } else {
          return (
            <Card key={index} type={card.type} hoverEffect={true} onClick={() => setSelectIdx(index)} />
          );
        }
      })}
    </div>
  );
};

export default Cards;
