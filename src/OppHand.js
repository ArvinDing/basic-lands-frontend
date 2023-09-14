// Opponent hand
import React from 'react';
import Card from './Card';
import './OppHand.css'

const OppCards = ({ cards }) => {
  return (
    <div className="opp-cards-container">
      {cards.map((card, index) => (
        <Card key={index} type={card.type} hand/>
      ))}
    </div>
  );
};

export default OppCards;
