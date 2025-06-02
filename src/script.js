// Initialisation des variables principales
let rows, cols;
let grid = [], currentPlayer = "red", gameOver = false;
let scoreRouge = 0, scoreJaune = 0;
let historiqueCoups = [];

// Références DOM
const board = document.getElementById("gameBoard");
const winnerMessage = document.getElementById("winnerMessage");
const currentPlayerText = document.getElementById("currentPlayer");
const sizeModal = document.getElementById("sizeModal");
const nameModal = document.getElementById("nameModal");
const validateButton = document.getElementById("validateNames");
const startButton = document.getElementById("startGame");
const resetButton = document.getElementById("resetButton");
const undoButton = document.getElementById("undoMove");

// Style initial
window.onload = () => {
  Object.assign(winnerMessage.style, {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    margin: "15px 0",
    padding: "10px",
    borderRadius: "8px",
    transition: "all 0.3s ease"
  });
  sizeModal.style.display = "flex";
};

// Boutons
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
undoButton.addEventListener("click", undoLastMove);
validateButton.addEventListener("click", validatePlayers);

function startGame() {
  rows = parseInt(document.getElementById("rowsInput").value);
  cols = parseInt(document.getElementById("colsInput").value);

  if (isNaN(rows) || isNaN(cols) || rows < 4 || cols < 4 || rows > 40 || cols > 40) {
    return alert("Veuillez entrer une taille entre 4 et 40.");
  }

  grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  historiqueCoups = [];
  gameOver = false;
  currentPlayer = "red";
  currentPlayerText.textContent = `Tour du joueur : ${currentPlayer}`;
  winnerMessage.textContent = "";
  winnerMessage.style.backgroundColor = "transparent";
  sizeModal.style.display = "none";
  nameModal.style.display = "flex";
  undoButton.style.display = "none";
}

function resetGame() {
  if (!rows || !cols) return (sizeModal.style.display = "flex");
  grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  historiqueCoups = [];
  gameOver = false;
  currentPlayer = "red";
  winnerMessage.textContent = "";
  winnerMessage.style.backgroundColor = "transparent";
  currentPlayerText.textContent = `Tour du joueur : ${currentPlayer}`;
  undoButton.style.display = "none";
  updateBoard();
}

function validatePlayers() {
  const playerRed = document.getElementById("playerRed").value.trim();
  const playerYellow = document.getElementById("playerYellow").value.trim();

  if (!playerRed || !playerYellow) return alert("Veuillez entrer les prénoms des deux joueurs !");

  localStorage.setItem("playerRed", playerRed);
  localStorage.setItem("playerYellow", playerYellow);
  document.getElementById("displayPlayerRed").textContent = playerRed;
  document.getElementById("displayPlayerYellow").textContent = playerYellow;
  nameModal.style.display = "none";
  createGrid();
}

function createGrid() {
  board.innerHTML = "";
  board.style.display = "grid";
  let cellSize = Math.min(500 / cols, 500 / rows);
  board.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let cell = document.createElement("div");
      Object.assign(cell, {
        className: "cell",
        dataset: { row, col }
      });
      cell.style.width = cell.style.height = `${cellSize}px`;
      cell.addEventListener("click", () => dropToken(col));
      board.appendChild(cell);
    }
  }
}

function dropToken(col) {
  if (gameOver) return;

  for (let row = rows - 1; row >= 0; row--) {
    if (!grid[row][col]) {
      animateTokenDrop(row, col, currentPlayer, () => {
        grid[row][col] = currentPlayer;
        historiqueCoups.push({ row, col, player: currentPlayer });
        updateBoard();

        if (checkWin(row, col)) return handleWin();
        if (checkDraw()) return handleDraw();

        currentPlayer = currentPlayer === "red" ? "yellow" : "red";
        currentPlayerText.textContent = `Tour du joueur : ${currentPlayer}`;
        undoButton.style.display = "inline-block";
      });
      break;
    }
  }
}

function animateTokenDrop(row, col, color, callback) {
  let cellSize = Math.min(500 / cols, 500 / rows);
  let targetCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  let topCell = document.querySelector(`.cell[data-row="0"][data-col="${col}"]`);

  let token = document.createElement("div");
  token.classList.add("token");
  Object.assign(token.style, {
    width: `${cellSize - 10}px`,
    height: `${cellSize - 10}px`,
    borderRadius: "50%",
    backgroundColor: color,
    position: "absolute",
    zIndex: "100",
    transition: "top 0.5s ease-in",
    left: `${topCell.offsetLeft + 5}px`,
    top: `${topCell.offsetTop + 5}px`
  });

  board.appendChild(token);

  setTimeout(() => {
    token.style.top = `${targetCell.offsetTop + 5}px`;
    setTimeout(() => {
      token.remove();
      callback();
    }, 550);
  }, 50);
}

function updateBoard() {
  document.querySelectorAll(".cell").forEach(cell => {
    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);
    cell.style.backgroundColor = grid[row][col] || "lightgray";
  });
}

function undoLastMove() {
  if (!historiqueCoups.length) return;
  if (gameOver) {
    gameOver = false;
    winnerMessage.textContent = "";
    winnerMessage.style.backgroundColor = "transparent";
    winnerMessage.style.border = "none";
  }
  const lastMove = historiqueCoups.pop();
  grid[lastMove.row][lastMove.col] = null;
  currentPlayer = lastMove.player;
  currentPlayerText.textContent = `Tour du joueur : ${currentPlayer}`;
  updateBoard();
}

function checkWin(row, col) {
  const directions = [
    { r: 1, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 1, c: -1 }
  ];

  return directions.some(({ r, c }) => {
    let count = 1;
    count += countInDirection(row, col, r, c);
    count += countInDirection(row, col, -r, -c);
    return count >= 4;
  });
}

function countInDirection(row, col, rStep, cStep) {
  let count = 0, color = grid[row][col];
  let r = row + rStep, c = col + cStep;

  while (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === color) {
    count++;
    r += rStep;
    c += cStep;
  }
  return count;
}

function checkDraw() {
  return grid.every(row => row.every(cell => cell !== null));
}

function handleWin() {
  const playerName = currentPlayer === "red" ? document.getElementById("displayPlayerRed").textContent : document.getElementById("displayPlayerYellow").textContent;
  winnerMessage.textContent = `${playerName} a gagné !`;
  winnerMessage.style.backgroundColor = currentPlayer === "red" ? "#ffcccc" : "#ffffcc";
  winnerMessage.style.border = `3px solid ${currentPlayer}`;
  winnerMessage.style.transform = "scale(1.1)";
  setTimeout(() => winnerMessage.style.transform = "scale(1)", 300);
  gameOver = true;
  updateScore(currentPlayer);
}

function handleDraw() {
  winnerMessage.textContent = "MATCH NUL !";
  winnerMessage.style.backgroundColor = "#cccccc";
  winnerMessage.style.border = "3px solid #666666";
  gameOver = true;
}

function updateScore(color) {
  if (color === "red") {
    scoreRouge++;
    document.getElementById("scoreRouge").textContent = scoreRouge;
  } else {
    scoreJaune++;
    document.getElementById("scoreJaune").textContent = scoreJaune;
  }
}
