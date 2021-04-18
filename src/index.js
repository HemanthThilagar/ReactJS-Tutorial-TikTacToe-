import React from "react";
import ReactDOM from "react-dom";
import './index.css';

const Square = (props) => {
  const highclass= props.highLight ? "square boxLight" : "square";

        return (
        <button 
            className={highclass}
            onClick={()=>props.onClick()}
        >
          {props.value}
        </button>
      );
    }
  
  
  class Board extends React.Component {
    
    renderSquare(i) {
      return ( 
        <Square key={i}
          value={this.props.squares[i]} 
          onClick={()=>this.props.onClick(i)}
          highLight={this.props.highLight && this.props.highLight.includes(i)}
        />
      );
    }
  
    render() {
      let col=[]
      for(let i=0;i<3;i++){
        let row=[];
        for(let j=0;j<3;j++){
        row.push(this.renderSquare(3*i+j));
        }
        col.push(<div className="board-row" key={i}>{row}</div>)
      }
      return (
        <div>
          {/* <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div> */}
          {col}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state={
        history:[{
          squares: Array(9).fill(null)
        },
      ],
      xisNext:true,
      stepNumber:0,
      stepLocation:[],
      boldy:null,
      ascend:true,
      }
    }
    handleClick(i) {
      const history = this.state.history.slice(0,this.state.stepNumber+1);    
      const current = history[history.length - 1];    
      const squares = current.squares.slice();
      if(calculateWinner(squares).winner || squares[i]){
        return
      }
      const stepLoc= stepPosition(i);
      squares[i]=this.state.xisNext ? "X": "O";
      this.setState({
        history:history.concat([{
          squares:squares
        }]),
        xisNext: !this.state.xisNext,
        stepNumber: history.length,
        stepLocation:this.state.stepLocation.slice(0,history.length-1).concat([stepLoc]),
        boldy:history.length
      });
    }

    jumpto(step){
      this.setState({
        stepNumber:step,
        xisNext: (step%2===0),
        boldy:step
      })
    }

    toggle(){
      this.setState({
        ascend:!this.state.ascend,
      })
    }

    render() {
      const history=this.state.history;
      const current = history[this.state.stepNumber];
      const winnerInfo = calculateWinner(current.squares.slice());
      const winner= winnerInfo ? winnerInfo.winner : null;
      const moves= history.map((step,move)=>{

        const desc=(move ? "Go to move #" +move+" ("+this.state.stepLocation[move-1]+" )" : "Got to start") ;
        return(
          <li key={move}>
            <button  className={move===this.state.boldy ? "boldy" : ""} onClick={()=> this.jumpto(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      if(winner){
         status="Winner: "+ winner
      }else {
        if(winnerInfo.letDraw){
          status= "Match Draw"
        }
        else{
        status = 'Next player: ' +(this.state.xisNext?'X':'O');
      }
    }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick ={ (i)=> this.handleClick(i)}
              highLight={winnerInfo ? winnerInfo.line : null} 
            />
          </div>
          <div className="game-info">
            <div><button onClick={()=>this.toggle()}>"Toggle"</button></div>
            <div>{status}</div>
            <ol>{this.state.ascend ? moves: moves.reverse()}</ol>
          </div>
        </div>
      );
    }
  }
  
const calculateWinner = (squares) =>{
  const lines=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c]=lines[i];
    if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]){
      return {
        winner:squares[a],
        line:[a,b,c],
        letDraw: false
      };
    }
  }
  let letDraw=true
  for (let i=0;i < squares.length;i++){
    if (squares[i]==null){
        letDraw=false
        break
    }
  }
    return {
      winner:null,
      line:null,
      letDraw: letDraw
    } ;
}

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  const stepPosition=(i)=>{
    if(i>=0 && i<3){
      i+=1
      return "col: "+i+" row: 1";
    }
    else if(i>=3 && i<6 ){
      i-=2
      return "col: "+i+", row: 2";
    }else{
      i-=5
      return "col: "+i+", row: 3";
    }
  }
  