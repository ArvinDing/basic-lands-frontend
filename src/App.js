import Board from './Board.js'
import JoinPage from './JoinPage.js'
import Chat from './Chat.js'

import io from 'socket.io-client'
import React, { Component } from 'react';

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
const COUNTER_SELECT = 5;
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
        hand: [],
        oppHand: [],
        field: [],
        oppField: [],
        graveyard: [],
        oppGraveyard: [],
        deck: [],
        oppDeck: [],
        isTurn: true
      },
      popUp: {
        enabled: false,
        cards: [],
        type: null,
        counterType: null
      },
      chat: [{ message: "Welcome!", talkingAboutYou: false }]
    }
    this.dotsIntervalId = 0;
    this.setIslandDisplay = this.setIslandDisplay.bind(this);
  }

  componentDidMount() {
    console.log("mounting")
    this.socket = io('ws://localhost:3001');
    console.log(this.socket)
    this.socket.on("log", (msg) => {
      this.setState({ chat: this.state.chat.concat(msg) })
    })
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
          console.log("island select")
          console.log(top4)
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
      if (board_info.state === COUNTER_SELECT) {
        if (board_info.counterInfo.myCounterTurn) {
          this.setState({
            popUp: {
              enabled: true,
              cards: hand,
              type: "counter",
              counterType: board_info.counterInfo.counterCard
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

    this.dotsIntervalId = setInterval(() => {
      this.setState({ dots: (this.state.dots + 1) % 4 });
    }, 1000)
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

  enteredInfo(gameID, name) {
    this.socket.emit("join game", { id: gameID, name: name });
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
    if (type === "plains" || type === "island" || type === "swamp"
      || type === "mountain" || type === "forest") {
      this.emitPlayCard()
    }
    this.setState({ handSelectIdx: -1 })
  }

  playCardConfirm = (popUpIndex, intendToCounter) => {
    let gameState = this.state.gameState
    if (gameState.state === SWAMP_SELECT) {
      if (popUpIndex === -1) return false;
      this.socket.emit("swamp select", { index: popUpIndex })
    } else if (gameState.state === MOUNTAIN_SELECT) {
      console.log(this.state.popUp.cards)
      console.log(popUpIndex)
      if (popUpIndex === -1) return false;
      this.socket.emit("mountain select", { type: this.state.popUp.cards[popUpIndex].type })
    } else if (gameState.state === FOREST_SELECT) {
      if (popUpIndex === -1) return false;
      this.socket.emit("forest select", { index: popUpIndex })
    } else if (gameState.state === ISLAND_SELECT) {
      let changed = []
      for (let islandInfo of this.state.islandDisplay) {
        if (!islandInfo.remove) {
          changed.push(islandInfo.idx)
        }
      }
      this.socket.emit("island select", changed)
    } else if (gameState.state === COUNTER_SELECT) {
      //popUpIndex should be an array
      let visibleCnt = this.state.visibleCnt;
      let counterObj = {}
      counterObj.cards = popUpIndex.map(idx => {
        if (idx < visibleCnt) {
          console.log({ index: idx, visible: true })
          return { index: idx, visible: true };
        } else {
          console.log({ index: idx - visibleCnt, visible: false })
          return { index: idx - visibleCnt, visible: false };
        }
      })
      counterObj.counter = intendToCounter
      if (intendToCounter) {//check that the info we are sending it good
        let target = ["island", this.state.popUp.counterType]
        let sCards = [this.state.gameState.hand[popUpIndex[0]].type, this.state.gameState.hand[popUpIndex[1]].type]
        target.sort()
        sCards.sort()
     
        if (!(target.every((value, index) => value === sCards[index]))) {
          alert("not the right cards")
          return false;
        }
        if (popUpIndex.length !== 2) {
          alert("invalid counter need  2 cards")
          return false;
        }
      }
      this.socket.emit("counter select", counterObj)
    }
    return true;
  }

  /*card.index must be number and card.visible must be boolean */
  emitPlayCard = () => {
    let visibleCnt = this.state.visibleCnt;
    let handIdx = this.state.handSelectIdx;
    if (handIdx < visibleCnt) {
      this.socket.emit("play card", { index: handIdx, visible: true })
    } else {
      this.socket.emit("play card", { index: handIdx - visibleCnt, visible: false })
    }
  }

  render() {
    if (this.state.loading) {
      return (<h1>Loading{'.'.repeat(this.state.dots)}</h1>)
    }

    if (this.state.joinPage) {
      return (
        <JoinPage onClick={(gameId, name) => this.enteredInfo(gameId, name)} />)
    }

    return (
      <div className="App" style={appStyle}>
        <Board state={this.state.gameState} placeCard={this.placeCard}
          handSelectIdx={this.state.handSelectIdx} setHandSelectIdx={this.setHandSelectIdx}
          isTurn={this.state.myTurn} endTurnButtonOnClick={() => { this.endTurn() }}
          popUp={this.state.popUp} setPopUp={(x) => { this.setState({ popUp: x }) }}
          onConfirm={this.playCardConfirm} islandDisplay={this.state.islandDisplay}
          setIslandDisplay={this.setIslandDisplay} />
        <Chat messages={this.state.chat} />
      </div>
    );
  }
}

export default App;
