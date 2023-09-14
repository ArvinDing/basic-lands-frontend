import Board from './Board.js'
import JoinPage from './JoinPage.js'

import io from 'socket.io-client'
import React, { Component } from 'react';
const cardData = [
  { type: "swamp" },
  { type: "plains" },
  { type: "mountain" },
  { type: "island" },
  { type: "forest" },
  { type: "swamp" },
  { type: "plains" },
  { type: "mountain" },
  { type: "island" },
  { type: "forest" }
];

const cardData1 = [
  { type: "swamp" },
  { type: "swamp" },
  { type: "swamp" },
]


const cardData2 = [
  { type: "mountain" },
  { type: "swamp" },
  { type: "mountain" },
]

const cardData3 = [
  { type: "forest" },
  { type: "forest" },
  { type: "forest" },
  { type: "mountain" }
]

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
      loading: false,
      dots: 0,
      joinPage: false,
      handSelectIdx: -1,
      savedHandSelectIdx: -1,
      islandDisplay: null,  /*could be [{ idx: 0, remove: false }, { idx: 1, remove: false },
      { idx: 2, remove: false }, { idx: 3, remove: false }],*/
      gameState: {
        hand: cardData,
        oppHand: oppCardData,
        field: cardData2,
        oppField: cardData3,
        graveyard: cardData,
        oppGraveyard: cardData1,
        deck: cardData,
        oppDeck: cardData,
        isTurn: true
      },
      popUp: {
        enabled: false,
        cards: [],
        type: null
      }
    }
    this.dotsIntervalId = 0;
    this.setIslandDisplay = this.setIslandDisplay.bind(this);
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
    alert("join game " + gameID)
    this.socket.emit("join game", gameID);
    this.setState({ loading: true });
  }

  setIslandDisplay(x) {
    console.log(x)
    this.setState({ islandDisplay: x });
  }

  setHandSelectIdx = (idx) => {
    if (idx === this.state.handSelectIdx)
      this.setState({ handSelectIdx: -1 });
    else
      this.setState({ handSelectIdx: idx });
  }

  placeCard = () => {
    let gameState = this.state.gameState
    let handIdx = this.state.handSelectIdx;
    if (handIdx === -1) return;
    let type = gameState.hand[handIdx].type
    if (type === "plains") {
      //need to annouce im playing plain
      alert("i playing plains" + handIdx)
    } else if (type === "island") {
      //need to query for top 4
      alert("give me the top 4 on deck for island")
    } else if (type === "swamp") {
      //need to query for actual oppHand, is currently hidden
      alert("give me opponent hand")
      this.setState({
        popUp: {
          enabled: true,
          cards: gameState.oppHand,
          type: type,
        }
      })
    } else if (type === "mountain") {
      this.setState({
        popUp: {
          enabled: true,
          cards: gameState.oppField,
          type: type,
        }
      })
    } else if (type === "forest") {
      this.setState({
        popUp: {
          enabled: true,
          cards: gameState.graveyard,
          type: type,
        }
      })
    }
    this.setState({ savedHandSelectIdx: this.state.handSelectIdx })
    this.setState({ handSelectIdx: -1 })
  }

  emitPlayCard = (popUpIndex) => {
    let gameState = this.state.gameState
    let handIdx = this.state.savedHandSelectIdx;
    let type = gameState.hand[handIdx].type
    alert("type" + type + " " + popUpIndex + " " + this.state.popUp.cards[popUpIndex].type)
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
        <Board state={this.state.gameState} placeCard={this.placeCard}
          handSelectIdx={this.state.handSelectIdx} setHandSelectIdx={this.setHandSelectIdx}
          isTurn={this.state.myTurn} endTurnButtonOnClick={() => { this.endTurn() }}
          popUp={this.state.popUp} setPopUp={(x) => { this.setState({ popUp: x }) }}
          emitPlayCard={this.emitPlayCard} islandDisplay={this.state.islandDisplay}
          setIslandDisplay={this.setIslandDisplay} />
      </div>
    );
  }
}

export default App;
