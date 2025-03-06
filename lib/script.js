"use strict";

var rows, cols;
var board = document.getElementById("gameBoard");
var winnerMessage = document.getElementById("winnerMessage");
var currentPlayerText = document.getElementById("currentPlayer");
var modal = document.getElementById("sizeModal");
var grid = [];
var currentPlayer = "red";
var gameOver = false;
var scoreRouge = 0;
var scoreJaune = 0;

// Afficher la modale au chargement de la page
window.onload = function () {
  modal.style.display = "flex";
};

// Fonction pour démarrer le jeu après sélection de la taille
function startGame() {
  rows = parseInt(document.getElementById("rowsInput").value);
  cols = parseInt(document.getElementById("colsInput").value);
  if (isNaN(rows) || isNaN(cols) || rows < 4 || cols < 4 || rows > 10 || cols > 10) {
    alert("Veuillez entrer une taille entre 4 et 10.");
    return;
  }
  grid = Array.from({
    length: rows
  }, function () {
    return Array(cols).fill(null);
  });
  modal.style.display = "none"; // Cacher le popup
  createGrid();
}

// Fonction pour générer la grille dynamiquement
function createGrid() {
  board.innerHTML = "";
  board.style.display = "grid";
  board.style.gridTemplateColumns = "repeat(".concat(cols, ", 50px)");
  for (var row = 0; row < rows; row++) {
    var _loop = function _loop(col) {
      var cell = document.createElement("div");
      cell.classList.add("cell");
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

// Fonction pour ajouter un jeton dans la colonne choisie avec animation
function dropToken(col) {
  if (gameOver) return;
  for (var row = rows - 1; row >= 0; row--) {
    if (!grid[row][col]) {
      grid[row][col] = currentPlayer;
      animateTokenDrop(row, col, currentPlayer);
      if (checkWin(row, col)) {
        winnerMessage.textContent = "".concat(currentPlayer === "red" ? "ROUGE" : "JAUNE", " a gagn\xE9 !");
        winnerMessage.style.color = currentPlayer;
        gameOver = true;
        mettreAJourScore(currentPlayer); // AJOUT DE LA MISE À JOUR DU SCORE
        return;
      }
      if (checkDraw()) {
        winnerMessage.textContent = "MATCH nul !";
        winnerMessage.style.color = "blue";
        gameOver = true;
        return;
      }
      currentPlayer = currentPlayer === "red" ? "yellow" : "red";
      currentPlayerText.textContent = "Tour du joueur : ".concat(currentPlayer === "red" ? "Rouge" : "Jaune");
      return;
    }
  }
}

// Fonction pour animer la chute du jeton
function animateTokenDrop(row, col, color) {
  var cell = document.querySelector("[data-row='".concat(row, "'][data-col='").concat(col, "']"));
  var token = document.createElement("div");
  token.style.width = "50px";
  token.style.height = "50px";
  token.style.borderRadius = "50%";
  token.style.position = "absolute";
  token.style.backgroundColor = color;
  token.style.left = "".concat(col * 55, "px");
  token.style.top = "-60px";
  token.style.transition = "top 0.5s ease-in";
  board.appendChild(token);
  setTimeout(function () {
    token.style.top = "".concat(row * 55, "px");
  }, 50);
  setTimeout(function () {
    token.remove();
    updateBoard();
  }, 600);
}
function checkDraw() {
  return grid.every(function (row) {
    return row.every(function (cell) {
      return cell !== null;
    });
  });
}

// Vérifier si un joueur a gagné
function checkWin(row, col) {
  return checkDirection(row, col, 0, 1) || checkDirection(row, col, 1, 0) || checkDirection(row, col, 1, 1) || checkDirection(row, col, 1, -1);
}
function checkDirection(row, col, rowDir, colDir) {
  var count = 1;
  var color = grid[row][col];
  count += countInDirection(row, col, rowDir, colDir, color);
  count += countInDirection(row, col, -rowDir, -colDir, color);
  return count >= 4;
}
function countInDirection(row, col, rowDir, colDir, color) {
  var count = 0;
  var r = row + rowDir;
  var c = col + colDir;
  while (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === color) {
    count++;
    r += rowDir;
    c += colDir;
  }
  return count;
}

// Mise à jour de l'affichage de la grille
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

// Réinitialisation du jeu
function resetGame() {
  grid = Array.from({
    length: rows
  }, function () {
    return Array(cols).fill(null);
  });
  currentPlayer = "red";
  gameOver = false;
  winnerMessage.textContent = "";
  currentPlayerText.textContent = "Tour du joueur : Rouge";
  createGrid();
}

// Ajout du système de score
function mettreAJourScore(gagnant) {
  if (gagnant === "red") {
    scoreRouge++;
    document.getElementById("scoreRouge").textContent = scoreRouge;
  } else if (gagnant === "yellow") {
    scoreJaune++;
    document.getElementById("scoreJaune").textContent = scoreJaune;
  }
}

// Bouton de réinitialisation
document.getElementById("resetButton").addEventListener("click", resetGame);