import Board from './Board.js'
import JoinPage from './JoinPage.js'

import io from 'socket.io-client'
import React, { Component } from 'react';

const cardData = [
  { type: "swamp" },
  { type: "plains" },
  { type: "mountain" },
  { type: "island" },
  { type: "forest" }
];

const oppCardData = [
  { type: "unknown" }
];

const appStyle = {
  height: '100%'
}

class App extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      myTurn: true,
      loading: false,
      dots: 0,
      joinPage: false,
      selectIdx: -1
    }
    this.dotsIntervalId = 0;
  }

  componentDidMount() {
    console.log("mounting")
    this.socket = io('ws://localhost:3001');
    console.log(this.socket)

    this.socket.on("board state", (board_info) => {
      console.log("board state changed")
      this.setState({ loading: false });
      this.myTurn = board_info.myTurn;
    });

    this.socket.on("invalid game", () => {
      alert("invalid game")
    });

    this.socket.on("waiting for other player", () => {
      console.log("waiting for other player")
      alert("waiting for other player")
    })

    this.socket.on("new turn", (board_info) => {
      console.log("board state changed")
      this.myTurn = board_info.myTurn;
    });

    this.dotsIntervalId = setInterval(() => {
      this.setState({ dots: (this.state.dots + 1) % 4 });
    }, 500)
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
    if (this.dotsIntervalId !== 0) {
      clearInterval(this.dotsIntervalId);
    }
  }

  endTurn() {
    alert("ended turn");
    this.socket.emit("end turn", {});
  }

  enteredGameID(gameID) {
    console.log("game id" + gameID);
    this.socket.emit("join game", gameID);
    this.setState({ loading: true });
  }

  setSelectIdx = (idx) => {
    if (idx == this.state.selectIdx)
      this.setState({ selectIdx: -1 })
    else
      this.setState({ selectIdx: idx })
  }

  playCard = () => {
    if(this.state.selectIdx!=-1){
      alert("played" + this.state.selectIdx)
      this.setState({ selectIdx: -1 })
    }
  }

  render() {
    if (this.state.loading) {
      return (<h1>Loading{'.'.repeat(this.state.dots)}</h1>)
    }

    if (this.state.joinPage) {
      return (<JoinPage onClick={(gameId) => this.enteredGameID(gameId)} />)
    }

    return (
      <div className="App" style={appStyle}>
        <Board cards={cardData} playCard={this.playCard} selectIdx={this.state.selectIdx} setSelectIdx={this.setSelectIdx} oppCards={oppCardData} isTurn={this.state.myTurn} endTurnButtonOnClick={() => { this.endTurn() }} />
      </div>
    );
  }
}

export default App;
