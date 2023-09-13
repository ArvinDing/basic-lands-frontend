import React from 'react';
import Card from './Card';
import './Graveyard.css'

const Graveyard = ({ cards, opponent, onClick }) => {
  let style = opponent ? { marginTop: '10%' } : {};
  return (
    //<button className="close-button" onClick={onClose}>X</button> {/* Close button */}
    <div className="graveyard-container" style={style}>
      {cards.map((card, index) => (
        <Card key={index} type={card.type} graveyard onClick = {onClick}/>
      ))}
    </div>
  );
};

export default Graveyard;
