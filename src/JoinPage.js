import React from 'react';
import './JoinPage.css'

const JoinPage = ({ onClick }) => {
  const handleClick = () => {
    const gameIdInput = document.getElementById("gameID");
    if (gameIdInput) {
      const gameId = gameIdInput.value;
      onClick(gameId);
    }
  }
  return (
    <div className="join-page">
      <h1>Basic Lands Game</h1>
      <input type="text" id="gameID" placeholder="Enter Game ID" />
      <button className="hoverChange" onClick={handleClick}>Play</button>
    </div>
  );
};

export default JoinPage;
