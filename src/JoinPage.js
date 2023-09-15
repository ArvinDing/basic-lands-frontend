import React from 'react';
import './JoinPage.css'

const JoinPage = ({ onClick }) => {
  const handleClick = () => {
    const gameIdInput = document.getElementById("gameID");
    const nameInput= document.getElementById("name")
    if (gameIdInput && nameInput) {
      const gameId = gameIdInput.value;
      const name = nameInput.value;
      onClick(gameId,name);
    }
  }
  return (
    <div className="join-page">
      <h1>Basic Lands Game</h1>
      <input type="text" id="gameID" placeholder="Enter Game ID" />
      <input type="text" id="name" placeholder="Enter Name" />
      <button className="hoverChange" onClick={handleClick}>Play</button>
    </div>
  );
};

export default JoinPage;
