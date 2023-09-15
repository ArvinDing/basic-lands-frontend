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

const cardTypes =
{
  swamp: { type: "swamp" },
  forest: { type: "forest" },
  plains: { type: "plains" },
  island: { type: "island" },
  mountain: { type: "mountain" },
}

const unknownCard =
  { type: "unknown" };

const appStyle = {
  height: '100%'
}

const TURN_START = 0;
const MOUNTAIN_SELECT = 1;
const FOREST_SELECT = 2;
const ISLAND_SELECT = 3;
const SWAMP_SELECT = 4;
const WAIT_FOR_ISLAND_COUNTER = 5;
const GAME_OVER = 6;

const repeat = (value, times) => {
  const repeatedArray = Array.from({ length: times }, () => JSON.parse(JSON.stringify(value)));
  return repeatedArray;
}
class App extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      loading: false,
      dots: 0,
      joinPage: true,
      handSelectIdx: -1,
      islandDisplay: null,  /*could be [{ idx: 0, remove: false }, { idx: 1, remove: false },
      { idx: 2, remove: false }, { idx: 3, remove: false }],*/
      visibleCnt: 0,
      gameState: {
        state: -1,
        deckCnt: 0,
        oppDeckCnt: 0,
        hand: cardData,
        oppHand: cardData,
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
      console.log("board state changed" + board_info)
      //visible on the left and hidden on the right
      let hand = (board_info.cards[0].hand.visible).map(card => ({ type: card, oppSee: true }));
      hand = hand.concat((board_info.cards[0].hand.hidden).map(card => ({ type: card, oppSee: false })));
      //same with opponent hand
      let oppHand = (board_info.cards[1].hand.visible).map(card => ({ type: card }))
        .concat(repeat(unknownCard, board_info.cards[1].hand.hidden));

      console.log(oppHand)
      let deck = repeat(unknownCard, board_info.cards[0].deck);
      let oppDeck = repeat(unknownCard, board_info.cards[1].deck);
      let field = []
      let oppField = []

      for (let cardType in cardTypes) {
        field = field.concat(repeat(cardTypes[cardType], board_info.cards[0].board[cardType]));
        oppField = oppField.concat(repeat(cardTypes[cardType], board_info.cards[1].board[cardType]));
      }

      let graveyard = board_info.cards[0].discard.map(card => ({ type: card }));
      let oppGraveyard = board_info.cards[1].discard.map(card => ({ type: card }));
      let top4 = null
      let islandDisplay = null
      if (board_info.cards[0].top4) {
        top4 = board_info.cards[0].top4.map(card => ({ type: card }))
        islandDisplay = Array.from({ length: top4.length }, (_, idx) => ({ idx, remove: false }))
      }
      let deckCnt = board_info.cards[0].deck
      let oppDeckCnt = board_info.cards[1].deck
      this.setState({
        islandDisplay: islandDisplay,
        loading: false,
        gameState: {
          state: board_info.state,
          hand: hand,
          deckCnt: deckCnt,
          oppDeckCnt: oppDeckCnt,
          oppHand: oppHand,
          isTurn: board_info.myTurn,
          deck: deck,
          oppDeck: oppDeck,
          field: field,
          oppField: oppField,
          graveyard: graveyard,
          oppGraveyard: oppGraveyard
        },
        visibleCnt: board_info.cards[0].hand.visible.length
      });
      if (board_info.myTurn) {
        if (board_info.state === ISLAND_SELECT) {
          console.log(top4 + " " + islandDisplay)
          this.setState({
            popUp: {
              enabled: true,
              cards: top4,
              type: "island",
            }
          })
        } else if (board_info.state === MOUNTAIN_SELECT) {
          this.setState({
            popUp: {
              enabled: true,
              cards: oppField,
              type: "mountain",
            }
          })
        } else if (board_info.state === FOREST_SELECT) {
          this.setState({
            popUp: {
              enabled: true,
              cards: graveyard,
              type: "forest",
            }
          })
        } else if (board_info.state === SWAMP_SELECT) {
          //no backing out already revealed cards
          this.setState({
            popUp: {
              enabled: true,
              cards: oppHand,
              type: "swamp",
            }
          })
        }
      }
    });

    this.socket.on("invalid game", () => {
      this.setState({ joinPage: true })
      this.setState({ loading: false });
      alert("game id already used")
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
    this.socket.emit("end turn", {});
  }

  enteredGameID(gameID) {
    this.socket.emit("join game", gameID);
    this.setState({ joinPage: false })
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
      this.emitPlayCard()
    } else if (type === "island") {
      //need to query for top 4
      this.emitPlayCard()
    } else if (type === "swamp") {
      //need to query for actual oppHand, is currently hidden
      this.emitPlayCard()
    } else if (type === "mountain") {
      this.emitPlayCard()
    } else if (type === "forest") {
      this.emitPlayCard()
    }
    this.setState({ handSelectIdx: -1 })
  }

  playCardConfirm = (popUpIndex) => {
    let gameState = this.state.gameState
    if (gameState.state === SWAMP_SELECT) {
      this.socket.emit("swamp select", { index: popUpIndex })
    } else if (gameState.state === MOUNTAIN_SELECT) {
      console.log(this.state.popUp.cards)
      console.log(popUpIndex)

      this.socket.emit("mountain select", { type: this.state.popUp.cards[popUpIndex].type })
    } else if (gameState.state === FOREST_SELECT) {
      this.socket.emit("forest select", { index: popUpIndex })
    } else if (gameState.state === ISLAND_SELECT) {
      let changed = []
      for (let islandInfo of this.state.islandDisplay) {
        if (!islandInfo.remove) {
          changed.push(islandInfo.idx)
        }
      }
      this.socket.emit("island select", changed)
    }
  }

  /*card.index must be number and card.visible must be boolean */
  emitPlayCard = () => {
    let visibleCnt = this.state.visibleCnt;
    let handIdx = this.state.handSelectIdx;
    if (handIdx < visibleCnt) {
      this.socket.emit("play card", { index: handIdx, visible: true })
    } else {
      this.socket.emit("play card", { index: handIdx, visible: false })
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
        <Board state={this.state.gameState} placeCard={this.placeCard}
          handSelectIdx={this.state.handSelectIdx} setHandSelectIdx={this.setHandSelectIdx}
          isTurn={this.state.myTurn} endTurnButtonOnClick={() => { this.endTurn() }}
          popUp={this.state.popUp} setPopUp={(x) => { this.setState({ popUp: x }) }}
          emitPlayCard={this.playCardConfirm} islandDisplay={this.state.islandDisplay}
          setIslandDisplay={this.setIslandDisplay} />
      </div>
    );
  }
}

export default App;
