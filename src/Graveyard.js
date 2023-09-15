import React from 'react';
import Card from './Card';
import './Graveyard.css'

const Graveyard = ({ cards, opponent, onClick }) => {
  let style = !opponent ? { top: '60vh' } : {};
  return (
    <div className="graveyard-container" style={style}>
      {cards.map((card, index) => (
        <Card key={index} type={card.type} graveyard onClick = {onClick}/>
      ))}
    </div>
  );
};

export default Graveyard;
