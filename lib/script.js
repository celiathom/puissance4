"use strict";

var rows, cols;
var board = document.getElementById("gameBoard");
var winnerMessage = document.getElementById("winnerMessage");
var currentPlayerText = document.getElementById("currentPlayer");
var sizeModal = document.getElementById("sizeModal");
var nameModal = document.getElementById("nameModal");
var validateButton = document.getElementById("validateNames");
var startButton = document.getElementById("startGame");
var grid = [];
var currentPlayer = "red";
var gameOver = false;
var scoreRouge = 0;
var scoreJaune = 0;

// Afficher la première modale (taille de la grille) au chargement
window.onload = function () {
  sizeModal.style.display = "flex";
};

// Fonction pour démarrer le jeu après sélection de la taille
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
  sizeModal.style.display = "none"; // Cacher la pop-up des dimensions
  nameModal.style.display = "flex"; // Afficher la pop-up des prénoms
}

// Vérifier et stocker les prénoms des joueurs
validateButton.addEventListener("click", function () {
  var playerRed = document.getElementById("playerRed").value.trim();
  var playerYellow = document.getElementById("playerYellow").value.trim();
  if (playerRed === "" || playerYellow === "") {
    alert("Veuillez entrer les prénoms des deux joueurs !");
    return;
  }
  localStorage.setItem("playerRed", playerRed);
  localStorage.setItem("playerYellow", playerYellow);
  nameModal.style.display = "none"; // Fermer la pop-up des prénoms

  document.getElementById("displayPlayerRed").textContent = playerRed;
  document.getElementById("displayPlayerYellow").textContent = playerYellow;
  createGrid(); // Générer la grille après validation des prénoms
});

// Génération dynamique de la grille
function createGrid() {
  board.innerHTML = "";
  board.style.display = "grid";
  var cellSize = cols > 15 || rows > 15 ? 30 : 50;
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

// Gestion du bouton "Démarrer"
startButton.addEventListener("click", startGame);