"use strict";

var rows, cols;
var board = document.getElementById("gameBoard");
var winnerMessage = document.getElementById("winnerMessage");
var currentPlayerText = document.getElementById("currentPlayer");
var sizeModal = document.getElementById("sizeModal");
var nameModal = document.getElementById("nameModal");
var validateButton = document.getElementById("validateNames");
var startButton = document.getElementById("startGame");
var resetButton = document.getElementById("resetButton");
var grid = [];
var currentPlayer = "red";
var gameOver = false;
var scoreRouge = 0;
var scoreJaune = 0;
window.onload = function () {
  sizeModal.style.display = "flex";
};

// ✅ Fonction pour démarrer le jeu
function startGame() {
  rows = parseInt(document.getElementById("rowsInput").value);
  cols = parseInt(document.getElementById("colsInput").value);
  if (isNaN(rows) || isNaN(cols) || rows < 4 || cols < 4 || rows > 40 || cols > 40) {
    alert("Veuillez entrer une taille entre 4 et 40.");
    return;
  }
  grid = Array.from({
    length: rows
  }, function () {
    return Array(cols).fill(null);
  });
  sizeModal.style.display = "none";
  nameModal.style.display = "flex";
}

// ✅ Fonction pour valider les noms et afficher la grille
validateButton.addEventListener("click", function () {
  var playerRed = document.getElementById("playerRed").value.trim();
  var playerYellow = document.getElementById("playerYellow").value.trim();
  if (playerRed === "" || playerYellow === "") {
    alert("Veuillez entrer les prénoms des deux joueurs !");
    return;
  }
  localStorage.setItem("playerRed", playerRed);
  localStorage.setItem("playerYellow", playerYellow);
  nameModal.style.display = "none";
  document.getElementById("displayPlayerRed").textContent = playerRed;
  document.getElementById("displayPlayerYellow").textContent = playerYellow;
  createGrid();
});

// ✅ Fonction pour générer la grille
function createGrid() {
  board.innerHTML = "";
  board.style.display = "grid";
  var cellSize = Math.min(500 / cols, 500 / rows);
  board.style.gridTemplateColumns = "repeat(".concat(cols, ", ").concat(cellSize, "px)");
  for (var row = 0; row < rows; row++) {
    var _loop = function _loop(col) {
      var cell = document.createElement("div");
      cell.classList.add("cell");
      cell.style.width = "".concat(cellSize, "px");
      cell.style.height = "".concat(cellSize, "px");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", function () {
        return dropToken(col);
      });
      board.appendChild(cell);
    };
    for (var col = 0; col < cols; col++) {
      _loop(col);
    }
  }
}
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

// ✅ Fonction pour ajouter un jeton et vérifier la victoire
function dropToken(col) {
  if (gameOver) return;
  for (var row = rows - 1; row >= 0; row--) {
    if (!grid[row][col]) {
      animateTokenDrop(row, col, currentPlayer);
      grid[row][col] = currentPlayer; // Enregistre le coup dans la grille

      // ✅ Vérifier si ce coup mène à la victoire
      if (checkWin(row, col)) {
        winnerMessage.textContent = "".concat(currentPlayer === "red" ? "ROUGE" : "JAUNE", " a gagn\xE9 !");
        winnerMessage.style.color = currentPlayer;
        gameOver = true;

        // ✅ Ajouter 1 point UNIQUEMENT si un joueur gagne
        updateScore(currentPlayer);
        return;
      }
      if (checkDraw()) {
        winnerMessage.textContent = "MATCH NUL !";
        winnerMessage.style.color = "blue";
        gameOver = true;
        return;
      }

      // Changer de joueur
      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      currentPlayerText.textContent = "Tour du joueur : ".concat(currentPlayer === "red" ? "Rouge" : "Jaune");
      return;
    }
  }
}

// ✅ Mise à jour des scores UNIQUEMENT quand un joueur gagne
function updateScore(winner) {
  if (winner === "red") {
    scoreRouge++;
    document.getElementById("scoreRouge").textContent = scoreRouge;
  } else if (winner === "yellow") {
    scoreJaune++;
    document.getElementById("scoreJaune").textContent = scoreJaune;
  }
}

// ✅ Jetons qui s'adaptent à la grille
function animateTokenDrop(row, col, color) {
  var cell = document.querySelector("[data-row='0'][data-col='0']");
  var cellSize = cell ? cell.offsetWidth : 50;
  var token = document.createElement("div");
  token.style.width = "".concat(cellSize, "px");
  token.style.height = "".concat(cellSize, "px");
  token.style.borderRadius = "50%";
  token.style.position = "absolute";
  token.style.backgroundColor = color;
  token.style.left = "".concat(col * cellSize, "px");
  token.style.top = "-60px";
  token.style.transition = "top 0.6s ease-in";
  board.appendChild(token);
  setTimeout(function () {
    token.style.top = "".concat(row * cellSize, "px");
  }, 50);
  setTimeout(function () {
    token.remove();
    updateBoard();
  }, 700);
}

// ✅ Mise à jour de la grille
function updateBoard() {
  var cells = document.querySelectorAll(".cell");
  cells.forEach(function (cell) {
    var row = cell.dataset.row;
    var col = cell.dataset.col;
    if (grid[row][col] === "red") {
      cell.style.backgroundColor = "red";
    } else if (grid[row][col] === "yellow") {
      cell.style.backgroundColor = "yellow";
    }
  });
}

// ✅ Vérifier la victoire
function checkWin(row, col) {
  var directions = [{
    r: 1,
    c: 0
  }, {
    r: 0,
    c: 1
  }, {
    r: 1,
    c: 1
  }, {
    r: 1,
    c: -1
  }];
  for (var _i = 0, _directions = directions; _i < _directions.length; _i++) {
    var _directions$_i = _directions[_i],
      r = _directions$_i.r,
      c = _directions$_i.c;
    var count = 1;
    count += countInDirection(row, col, r, c);
    count += countInDirection(row, col, -r, -c);
    if (count >= 4) return true;
  }
  return false;
}
function countInDirection(row, col, rStep, cStep) {
  var count = 0;
  var color = grid[row][col];
  var r = row + rStep;
  var c = col + cStep;
  while (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === color) {
    count++;
    r += rStep;
    c += cStep;
  }
  return count;
}

// ✅ Vérifier match nul
function checkDraw() {
  return grid.every(function (row) {
    return row.every(function (cell) {
      return cell !== null;
    });
  });
}

// ✅ Réinitialiser le jeu SANS remettre les scores à zéro
function resetGame() {
  grid = Array.from({
    length: rows
  }, function () {
    return Array(cols).fill(null);
  });
  gameOver = false;
  currentPlayer = "red";
  winnerMessage.textContent = "";
  currentPlayerText.textContent = "Tour du joueur : Rouge";
  createGrid();
}