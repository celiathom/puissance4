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
var undoButton = document.getElementById("undoMove");
var grid = [];
var currentPlayer = "red";
var gameOver = false;
var scoreRouge = 0;
var scoreJaune = 0;
var historiqueCoups = []; // ✅ Stockage des coups

window.onload = function () {
  // Appliquer un style au message du gagnant
  winnerMessage.style.fontSize = "2.5rem";
  winnerMessage.style.fontWeight = "bold";
  winnerMessage.style.color = "#333";
  winnerMessage.style.textAlign = "center";
  winnerMessage.style.margin = "15px 0";
  winnerMessage.style.padding = "10px";
  winnerMessage.style.borderRadius = "8px";
  winnerMessage.style.transition = "all 0.3s ease";
  sizeModal.style.display = "flex";
};

// ✅ Démarrer le jeu
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
  historiqueCoups = [];
  gameOver = false;
  winnerMessage.textContent = "";
  winnerMessage.style.backgroundColor = "transparent";
  currentPlayer = "red";
  currentPlayerText.textContent = "Tour du joueur : ".concat(currentPlayer);
  undoButton.style.display = "none"; // ✅ Masquer le bouton "Annuler"
  sizeModal.style.display = "none";
  nameModal.style.display = "flex";
}

// ✅ Réinitialiser le jeu (fonction ajoutée)
function resetGame() {
  if (rows && cols) {
    grid = Array.from({
      length: rows
    }, function () {
      return Array(cols).fill(null);
    });
    historiqueCoups = [];
    gameOver = false;
    winnerMessage.textContent = "";
    winnerMessage.style.backgroundColor = "transparent";
    currentPlayer = "red";
    currentPlayerText.textContent = "Tour du joueur : ".concat(currentPlayer);
    undoButton.style.display = "none";
    updateBoard();
  } else {
    // Si le jeu n'a pas encore été configuré, afficher la boîte de dialogue de sélection de taille
    sizeModal.style.display = "flex";
  }
}

// ✅ Validation des noms et génération de la grille
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

// ✅ Création dynamique de la grille
function createGrid() {
  board.innerHTML = "";
  board.style.display = "grid";
  var cellSize = Math.min(500 / cols, 500 / rows);
  board.style.gridTemplateColumns = "repeat(".concat(cols, ", ").concat(cellSize, "px)");
  board.style.position = "relative"; // Pour positionner correctement les jetons animés

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

// Assurez-vous que les écouteurs d'événements sont correctement ajoutés
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame); // Cet écouteur existe mais la fonction manquait
undoButton.addEventListener("click", undoLastMove);

// ✅ Ajouter un jeton
function dropToken(col) {
  if (gameOver) return;
  var _loop2 = function _loop2(row) {
      if (!grid[row][col]) {
        animateTokenDrop(row, col, currentPlayer, function () {
          grid[row][col] = currentPlayer;
          historiqueCoups.push({
            row: row,
            col: col,
            player: currentPlayer
          }); // ✅ Sauvegarde du coup
          updateBoard();
          if (checkWin(row, col)) {
            // Récupérer le nom du joueur pour l'afficher dans le message de victoire
            var playerName = currentPlayer === "red" ? document.getElementById("displayPlayerRed").textContent : document.getElementById("displayPlayerYellow").textContent;

            // Afficher le message de victoire avec le nom du joueur
            winnerMessage.textContent = "".concat(playerName, " a gagn\xE9 !");
            winnerMessage.style.backgroundColor = currentPlayer === "red" ? "#ffcccc" : "#ffffcc";
            winnerMessage.style.border = "3px solid ".concat(currentPlayer);

            // Animation de victoire
            winnerMessage.style.transform = "scale(1.1)";
            setTimeout(function () {
              winnerMessage.style.transform = "scale(1)";
            }, 300);
            gameOver = true;
            updateScore(currentPlayer);
            return;
          }
          if (checkDraw()) {
            winnerMessage.textContent = "MATCH NUL !";
            winnerMessage.style.backgroundColor = "#cccccc";
            winnerMessage.style.border = "3px solid #666666";
            gameOver = true;
            return;
          }
          currentPlayer = currentPlayer === "red" ? "yellow" : "red";
          currentPlayerText.textContent = "Tour du joueur : ".concat(currentPlayer);

          // ✅ Afficher le bouton "Annuler" après un premier coup
          undoButton.style.display = "inline-block";
        });
        return {
          v: void 0
        };
      }
    },
    _ret;
  for (var row = rows - 1; row >= 0; row--) {
    _ret = _loop2(row);
    if (_ret) return _ret.v;
  }
}

// ✅ Animation des pions - CORRIGÉE pour animation de descente
function animateTokenDrop(row, col, color, callback) {
  var cellSize = Math.min(500 / cols, 500 / rows);

  // Trouver la cellule cible
  var targetCell = document.querySelector(".cell[data-row=\"".concat(row, "\"][data-col=\"").concat(col, "\"]"));
  var topCell = document.querySelector(".cell[data-row=\"0\"][data-col=\"".concat(col, "\"]"));

  // Récupérer les positions
  var boardRect = board.getBoundingClientRect();
  var cellRect = targetCell.getBoundingClientRect();
  var topCellRect = topCell.getBoundingClientRect();

  // Créer le jeton avec position initiale en haut de la colonne
  var token = document.createElement("div");
  token.classList.add("token");
  token.style.width = "".concat(cellSize - 10, "px"); // Légèrement plus petit que la cellule
  token.style.height = "".concat(cellSize - 10, "px");
  token.style.borderRadius = "50%";
  token.style.backgroundColor = color;
  token.style.position = "absolute";
  token.style.left = "".concat(topCellRect.left - boardRect.left + 5, "px"); // Centrer horizontalement
  token.style.top = "".concat(topCellRect.top - boardRect.top + 5, "px"); // Position initiale en haut
  token.style.transition = "top 0.5s ease-in";
  token.style.zIndex = "100";
  board.appendChild(token);

  // Déclencher l'animation après un court délai pour s'assurer que le style initial est appliqué
  setTimeout(function () {
    // Déplacer vers la position finale
    token.style.top = "".concat(cellRect.top - boardRect.top + 5, "px");

    // Nettoyer et exécuter le callback après l'animation
    setTimeout(function () {
      token.remove();
      callback();
    }, 550); // Légèrement plus que la durée de l'animation
  }, 50);
}

// ✅ Mettre à jour la grille après animation
function updateBoard() {
  var cells = document.querySelectorAll(".cell");
  cells.forEach(function (cell) {
    var row = parseInt(cell.dataset.row);
    var col = parseInt(cell.dataset.col);
    if (grid[row][col] === "red") {
      cell.style.backgroundColor = "red";
    } else if (grid[row][col] === "yellow") {
      cell.style.backgroundColor = "yellow";
    } else {
      cell.style.backgroundColor = "lightgray";
    }
  });
}

// ✅ Annuler le dernier coup
function undoLastMove() {
  if (historiqueCoups.length === 0) return;
  if (gameOver) {
    gameOver = false; // Permettre de continuer le jeu après "annuler" si le jeu était terminé
    winnerMessage.textContent = "";
    winnerMessage.style.backgroundColor = "transparent";
    winnerMessage.style.border = "none";
  }
  var dernierCoup = historiqueCoups.pop();
  grid[dernierCoup.row][dernierCoup.col] = null; // ✅ Supprimer le dernier coup
  updateBoard();
  currentPlayer = dernierCoup.player; // Rester sur le même joueur qui vient de jouer
  currentPlayerText.textContent = "Tour du joueur : ".concat(currentPlayer);

  // ✅ Cacher le bouton "Annuler" s'il n'y a plus de coups
  if (historiqueCoups.length === 0) {
    undoButton.style.display = "none";
  }
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

// ✅ Mise à jour des scores
function updateScore(color) {
  if (color === "red") {
    scoreRouge++;
    document.getElementById("scoreRouge").textContent = scoreRouge;
  } else {
    scoreJaune++;
    document.getElementById("scoreJaune").textContent = scoreJaune;
  }
}