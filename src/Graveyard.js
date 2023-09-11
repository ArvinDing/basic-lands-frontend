import React from 'react';
import Card from './Card';
import './Graveyard.css'

const Graveyard = ({ cards }) => {
  const graveyardStyle = {
    marginLeft: '-40px',
    width:'50px',
    height:'71px'
  };

  return (
    <div className="cards-container">
      {cards.map((card, index) => (
        <Card key={index} type={card.type}  style={graveyardStyle}/>
      ))}
    </div>
  );
};

export default Graveyard;
