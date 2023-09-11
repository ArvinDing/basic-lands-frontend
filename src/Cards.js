// Cards.js
import React from 'react';
import Card from './Card';
import './Cards.css'

const Cards = ({ cards }) => {
  return (
    <div className="cards-container">
      {cards.map((card, index) => (
        <Card key={index} type={card.type} hoverEffect={true} />
      ))}
    </div>
  );
};

export default Cards;
