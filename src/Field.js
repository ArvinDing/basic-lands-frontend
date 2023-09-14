import React from 'react';
import Card from './Card';
import './Field.css'

const Field = ({ cards, onClick, enemy }) => {
  const enemyClass = (enemy) ? 'enemyField' : '';
  let cntType = {}

  cards.forEach((card) => {
    cntType[card.type] = (cntType[card.type] || 0) + 1
  })

  const sortedKeys = Object.keys(cntType).sort();

  return (
    <div className={`field-container ${enemyClass}`}>
      {
        sortedKeys.map((type, index) => {
          return (
            <Card key={index} onClick={() => { onClick() }} type={type} field num={cntType[type]} />
          );
        })
      }
    </div>
  );
};

export default Field;
