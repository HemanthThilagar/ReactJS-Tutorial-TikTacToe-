This is my personal solution to the further practice of React’s tic-tac-toe tutorial.

Here are the improvements listed in order of increasing difficulty:

    [X] Display the location for each move in the format (col, row) in the move history list.
    [X] Bold the currently selected item in the move list.
    [X] Rewrite Board to use two loops to make the squares instead of hardcoding them.
    [X] Add a toggle button that lets you sort the moves in either ascending or descending order.
    [X] When someone wins, highlight the three squares that caused the win.
    [X] When no one wins, display a message about the result being a draw.

Usage

git clone https://github.com/kelanwu/react-tic-tac-toe.git
cd react-tic-tac-toe
npm install
npm start

Follow-up tutorial

Start with the official final result here: Starter Code.
Display the location for each move

We’ve used the squares array to store the board state of each step in class Game. We can count out the lastest moved square of each step by comparing the current squares element to the previous one. But we will avoid this by storing the index of the lastest moved square in each history element in the handleClick method:

handleClick(i) {
  // ...
  this.setState({
    history: history.concat([
      {
        squares: squares,
        // Store the index of the latest moved square
        latestMoveSquare: i
      }
    ]),
  });
  // ...
}

With the lastestMoveSquare, we can easily count out the location of each move in the format (col, row) and append this format string to desc. Notice that we will use template string in the snippet, which is a feature from ES6:

render() {
  const history = this.state.history;
  const stepNumber = this.state.stepNumber;
  const current = history[stepNumber];

  const moves = history.map((step, move) => {
    const latestMoveSquare = step.latestMoveSquare;
    const col = 1 + latestMoveSquare % 3;
    const row = 1 + Math.floor(latestMoveSquare / 3);
    const desc = move ?
      `Go to move #${move} (${col}, ${row})` :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
      </li>
    );
  });
  // ...
}

Now if you run npm start in the project folder and open http://localhost:3000 in the browser, you should see the location for each move in each button of the move history list except the Go to game start.
Bold the currently selected item

Append this stype for bold item to your src/index.css file:

.move-list-item-selected{
  float: left;
  font-weight: bold;
}

With a little change in the render method of Game class, we can achieve the goal. We will apply the move-list-item-selected class if move === stepNumber, which means the item is selected:

render() {
  // ...
  const moves = history.map((step, move) => {
    const latestMoveSquare = step.latestMoveSquare;
    const col = 1 + latestMoveSquare % 3;
    const row = 1 + Math.floor(latestMoveSquare / 3);
    const desc = move ?
      `Go to move #${move} (${col}, ${row})` :
      'Go to game start';
    return (
      <li key={move}>
        {/* Bold the currently selected item */ }
        <button
          className={move === stepNumber ? 'move-list-item-selected' : ''}
          onClick={() => this.jumpTo(move)}>{desc}
        </button>
      </li>
    );
  });
  // ...
}

Use two loops to make the squares

The original implementation of rendering the squares in class Board is hardcoded. We can do it better by using two loops:

render() {
    // Use two loops to make the squares
    const boardSize = 3;
    let squares = [];
    for(let i=0; i<boardSize; ++i) {
      let row = [];
      for(let j=0; j<boardSize; ++j) {
        row.push(this.renderSquare(i * boardSize + j));
      }
      squares.push(<div key={i} className="board-row">{row}</div>);
    }

    return (
      <div>{squares}</div>
    );
  }

Each step in the first loop, we create a board row. And each step in the second loop, we add a square to the row.
Add a toggle button for sorting

So far, the moves list is displayed in ascending order by default, from game start to the latest step. We need to enable the moves list to be displayed in descending order, from lastest step to game start, and add a toggle button to switch the sorting order. At first, add isAscending state representing which order should be displayed to the constructor:

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // ...
      isAscending: true
    };
  }
  // ...
}

Add the toggle button to render method in Game. It will have different content according to the isAscending state:

render() {
  // ...
  const isAscending = this.state.isAscending;

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={i => this.handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={() => this.handleSortToggle()}>
          {isAscending ? 'descending' : 'ascending'}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

When the toggle button is clicked, handleSortToggle will be called. What this handler does is just flipping and saving the boolean state:

handleSortToggle() {
  this.setState({
    isAscending: !this.state.isAscending
  });
}

At last, the moves list should be displayed in the right order corresponding to the isAscending state. For ascending, the moves is in the right order already. For descending, we reverse the moves array to let it be in the right order. Note that we also change the definition of moves from const to let because we may change it:

render() {

  let moves = history.map((step, move) => {
    // ...
  });
  
  // ...

  const isAscending = this.state.isAscending;
  if (!isAscending) {
    moves.reverse();
  }

  return (
    // ...
  );
}

Highlight the squares when someone wins

Append this stype for highlight square to the src/index.css file:

.square.highlight {
  background: #ddd
}

We have used calculateWinner to declare the winner. We can get the three squares or the line that caused the win easily by modifying the return value of this function:

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
      };
    }
  }

  return {
    winner: null,
  };

Then change the handleClick in Game since the return value of calculateWinner has been modified:

handleClick(i) {
  // ...
  if (calculateWinner(squares).winner || squares[i]) {
    return;
  }
  // ...
}

Then also change the render in Game. And we will pass the winLine through props to Board:

render() {
  // ...
  const winInfo = calculateWinner(current.squares);
  const winner = winInfo.winner;

  let moves = history.map((step, move) => {
    // ...
  });

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (this.state.xIsNext ? "X" : "O");
  }

  // ...

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={i => this.handleClick(i)}
          winLine={winInfo.line}
        />
      </div>
      // ...
    </div>
  );
}

Then change the renderSquare in Board. If the current index of square is included in the winLine array, expression winLine && winLine.includes(i) will be evaluated to true, otherwise false. This will be passed to Square through the highlight props:

renderSquare(i) {
  const winLine = this.props.winLine;
  return (
    <Square
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      highlight={winLine && winLine.includes(i)}
    />
  );
}

Finally, Square will apply the css class depending on the highlight props:

function Square(props) {
  const className = 'square' + (props.highlight ? ' highlight' : '');
  return (
    <button
      className={className}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

Display draw message

If the board is full (no next move can be taken) and there is no winner, we can say that the result is a draw. To get whether the current move results in a draw, we need to revise the calculateWinner function:

function calculateWinner(squares) {
  const lines = [
    // ...
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
        isDraw: false,
      };
    }
  }

  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
  }
  return {
    winner: null,
    line: null,
    isDraw: isDraw,
  };
}

Now that the result object of the calculateWinner function has a new isDraw attribute. Then we will change the part for displaying game status of the render in Game:

render() {
  // ...

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    if (winInfo.isDraw) {
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
  }
  // ...
}

We have accomplished all the improvements. Check out the final code in this repository
