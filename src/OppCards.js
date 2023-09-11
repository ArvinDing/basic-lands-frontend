// OppCards.js - opponent hand
import React from 'react';
import Card from './Card';
import './OppCards.css'

const OppCards = ({ cards }) => {
  return (
    <div className="opp-cards-container">
      {cards.map((card, index) => (
        <Card key={index} type={card.type} />
      ))}
    </div>
  );
};

export default OppCards;
