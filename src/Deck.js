import React from 'react';
import Card from './Card';
import './Deck.css'

const Deck = ({ cardCnt, opponent }) => {
    let cards = []
    for (let i = 0; i < cardCnt; i++) {
        cards.push({ type: "unknown" })
    }
    let style = !opponent ? { top: '65vh' } : {};

    return (
        <div className="deck-container" style={style}>
            {cards.map((card, index) => (
                <Card key={index} type={card.type} deck />
            ))}
            <b>x{cardCnt}</b>
        </div>
    );
};

export default Deck;
