import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Définition des carrés
function Square(props) {
  // Si le joueur a gagne les cases gagnantes doivent s'allumer
  if (props.highlight) {
    return (
      <button className="square" style={{color: "green"}} onClick={() => props.onClick()}>
      {props.value}
      </button>
    );
  // Sinon les case ne s'allume pas
  } else {
    return (
      <button className="square" onClick={() => props.onClick()}>
      {props.value}
      </button>
    );
  }
}

// Définition du tableau
class Board extends React.Component {
  renderSquare(i) {
    // On déclare won à faux
    let won = false;
    // Si la position est gagnate alors
    if (this.props.winningPos && this.props.winningPos.indexOf(i) >= 0) {
      // on déclare won à vrai
      won = true;
    }
    // on retourne le carré
    return <Square key={i} value={this.props.squares[i]} highlight={won} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    let status;
    // Rendu du tableau avec les différents carrés
    return (
      <div>
      <div className="board-row">
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
      </div>
      </div>
    );
  }
}

// Définition du jeu
class Game extends React.Component {
  // Constructeur
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  // Historique
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move :
      'Go to game start';
      return (
        <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    let status;
    let winningPos;
    if (win) {
      status = 'Winner: ' + win.winner;
      winningPos = win.winningPos;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
      <div className="game-board">
      <Board
      squares={current.squares}
      winningPos={winningPos}
      onClick={(i) => this.handleClick(i)}
      />

      </div>
      <div className="game-info">
      <div>{status}</div>
      <ol>{moves}</ol>
      </div>
      </div>
    );
  }
}

//  Fonction qui permet de calculer le gagnant avec les différentes combinaisons possibles
function calculateWinner(squares) {
  //Définition des positions gagnantes
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // Je retourne le gagant et les positions gagnantes
      return {
        winner: squares[a],
        winningPos: lines[i]
      }
    }
  }
  return null;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
