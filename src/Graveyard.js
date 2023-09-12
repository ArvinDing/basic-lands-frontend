import React from 'react';
import Card from './Card';
import './Graveyard.css'

const Graveyard = ({ cards, style }) => {
  const graveyardStyle = {
    marginLeft: '-60px',
    width:'50px',
    height:'71px'
  };

  return (
    <div className="graveyard-container" style={style}>
      {cards.map((card, index) => (
        <Card key={index} type={card.type}  style={graveyardStyle}/>
      ))}
    </div>
  );
};

export default Graveyard;
