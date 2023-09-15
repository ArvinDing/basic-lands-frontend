import React from 'react';
import Card from './Card';
import './Hand.css'

const Hand = ({ cards, selectIdx, setSelectIdx, isTurn }) => {
  return (
    <div className="cards-container">
      {cards.map((card, index) => {
        if (index === selectIdx) {
          return (
            <Card key={index} type={card.type} hoverEffect={true}
              onClick={() => setSelectIdx(index)} selected={true} glowing={isTurn} hand oppSee={card.oppSee} />
          );
        } else {
          return (
            <Card key={index} type={card.type} hoverEffect={true}
              onClick={() => setSelectIdx(index)} glowing={isTurn} hand oppSee={card.oppSee}/>
          );
        }
      })}
    </div>
  );
};

export default Hand;
