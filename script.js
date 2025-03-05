const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));

  // If the cell is already filled or the game is over, do nothing.
  if (gameState[clickedIndex] !== '' || !gameActive) {
    return;
  }

  // Update game state and UI.
  gameState[clickedIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  // Check for win or tie.
  checkResult();
}

function checkResult() {
  let roundWon = false;
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
      continue;
    }
    if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    message.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (!gameState.includes('')) {
    message.textContent = "It's a tie!";
    gameActive = false;
    return;
  }

  // Switch player turns.
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  message.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
  currentPlayer = 'X';
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  message.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => (cell.textContent = ''));
}

// Add event listeners to cells and reset button.
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

// Initialize game message.
message.textContent = `Player ${currentPlayer}'s turn`;
