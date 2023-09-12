import React from 'react';
import Card from './Card';
import './Graveyard.css'

const Graveyard = ({ cards, opponent }) => {
  let style = opponent ? { marginTop: '10%' } : {};
  return (
    <div className="graveyard-container" style={style}>
      {cards.map((card, index) => (
        <Card key={index} type={card.type} graveyard />
      ))}
    </div>
  );
};

export default Graveyard;
