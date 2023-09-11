import Board from './Board.js'
import JoinPage from './JoinPage.js'

import io from 'socket.io-client'
import React, {Component} from 'react';

const cardData = [
  { type: "swamp" },
  { type: "plains" },
  { type: "mountain" },
  { type: "island" },
  {type: "forest"}
];

const appStyle = {
  height:'100%'
}

class App extends Component{
  constructor(props){
    super(props);
    this.socket = null;
    this.myTurn = false;
    this.state={
      loading: true,
      dots: 0,
      joinPage: false
    }
    this.dotsIntervalId = 0;
  }

  componentDidMount() {
    console.log("mounting")
    this.socket = io('ws://localhost:3001');
    console.log(this.socket)
    this.socket.emit("join game", 12345);
    this.socket.on("board state", (board_info)=>{
      console.log("board state changed")
      this.setState({loading:false});
      this.myTurn = board_info.myTurn;
    });

    this.socket.on("invalid game",()=>{
      alert("invalid game")
    });

    this.socket.on("waiting for other player", ()=>{
      console.log("waiting for other player")
      alert("waiting for other player")
    })

    this.dotsIntervalId = setInterval(() => {
      this.setState({dots: (this.state.dots+1)%4});
    }, 500)
  }

  componentWillUnmount() {
    if(this.socket){
        this.socket.disconnect();
    }
    if(this.dotsIntervalId!==0){
      clearInterval(this.dotsIntervalId);
    }
  }

  endTurn(){
    alert("ended turn")
    this.socket.emit("end turn",{});
  }
  
  render(){
    if(this.state.loading){
      return ( <h1>Loading{'.'.repeat(this.state.dots)}</h1>)
    }

    if(this.state.joinPage){
      return (<JoinPage/>)
    }

    return (
      <div className="App" style={appStyle}>
        <h1>{this.myTurn}</h1>
        <Board cards= {cardData} isTurn={this.myTurn} endTurnButtonOnClick={()=>{this.endTurn()}}/>
      </div>
    );
  }
}

export default App;
