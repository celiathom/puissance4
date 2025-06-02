let rows, cols;
let board = document.getElementById("gameBoard");
let winnerMessage = document.getElementById("winnerMessage");
let currentPlayerText = document.getElementById("currentPlayer");
let sizeModal = document.getElementById("sizeModal");
let nameModal = document.getElementById("nameModal");
let validateButton = document.getElementById("validateNames");
let startButton = document.getElementById("startGame");
let resetButton = document.getElementById("resetButton");
let undoButton = document.getElementById("undoMove");

let grid = [];
let currentPlayer = "red";
let gameOver = false;
let scoreRouge = 0;
let scoreJaune = 0;
let historiqueCoups = []; //Stockage des coups

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

//Démarrer le jeu
function startGame() {
    rows = parseInt(document.getElementById("rowsInput").value);
    cols = parseInt(document.getElementById("colsInput").value);

    if (isNaN(rows) || isNaN(cols) || rows < 4 || cols < 4 || rows > 40 || cols > 40) {
        alert("Veuillez entrer une taille entre 4 et 40.");
        return;
    }

    grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    historiqueCoups = [];
    gameOver = false;
    winnerMessage.textContent = "";
    winnerMessage.style.backgroundColor = "transparent";
    currentPlayer = "red";
    currentPlayerText.textContent = `Tour du joueur : ${currentPlayer}`;
    undoButton.style.display = "none";
    sizeModal.style.display = "none";
    nameModal.style.display = "flex";
}

// Réinitialiser le jeu
function resetGame() {
    if (rows && cols) {
        grid = Array.from({ length: rows }, () => Array(cols).fill(null));
        historiqueCoups = [];
        gameOver = false;
        winnerMessage.textContent = "";
        winnerMessage.style.backgroundColor = "transparent";
        currentPlayer = "red";
        currentPlayerText.textContent = `Tour du joueur : ${currentPlayer}`;
        undoButton.style.display = "none";
        updateBoard();
    } else {
        sizeModal.style.display = "flex";
    }
}

// Validation des joueurs
validateButton.addEventListener("click", function () {
    const playerRed = document.getElementById("playerRed").value.trim();
    const playerYellow = document.getElementById("playerYellow").value.trim();

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

// Création dynamique de la grille
function createGrid() {
    board.innerHTML = "";
    board.style.display = "grid";
    let cellSize = Math.min(500 / cols, 500 / rows);
    board.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    board.style.position = "relative";

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", () => dropToken(col));
            board.appendChild(cell);
        }
    }
}

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame); 
undoButton.addEventListener("click", undoLastMove);

// Ajouter un jeton
function dropToken(col) {
    if (gameOver) return;

    for (let row = rows - 1; row >= 0; row--) {
        if (!grid[row][col]) {
            animateTokenDrop(row, col, currentPlayer, () => {
                grid[row][col] = currentPlayer;
                historiqueCoups.push({ row, col, player: currentPlayer });
                updateBoard();

                if (checkWin(row, col)) {
                    let playerName = currentPlayer === "red" ? 
                        document.getElementById("displayPlayerRed").textContent : 
                        document.getElementById("displayPlayerYellow").textContent;
                    
                    winnerMessage.textContent = `${playerName} a gagné !`;
                    winnerMessage.style.backgroundColor = currentPlayer === "red" ? "#ffcccc" : "#ffffcc";
                    winnerMessage.style.border = `3px solid ${currentPlayer}`;
                    
                    winnerMessage.style.transform = "scale(1.1)";
                    setTimeout(() => {
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
                currentPlayerText.textContent = `Tour du joueur : ${currentPlayer}`;
                undoButton.style.display = "inline-block";
            });
            return;
        }
    }
}

//  Animation des pions
function animateTokenDrop(row, col, color, callback) {
    let cellSize = Math.min(500 / cols, 500 / rows);
    
    // Trouver la cellule cible
    let targetCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    let topCell = document.querySelector(`.cell[data-row="0"][data-col="${col}"]`);
    
    // Récupérer les positions
    let boardRect = board.getBoundingClientRect();
    let cellRect = targetCell.getBoundingClientRect();
    let topCellRect = topCell.getBoundingClientRect();
    
    // Créer le jeton avec position initiale en haut de la colonne
    let token = document.createElement("div");
    token.classList.add("token");
    token.style.width = `${cellSize - 10}px`;
    token.style.height = `${cellSize - 10}px`;
    token.style.borderRadius = "50%";
    token.style.backgroundColor = color;
    token.style.position = "absolute";
    token.style.left = `${topCellRect.left - boardRect.left + 5}px`; 
    token.style.top = `${topCellRect.top - boardRect.top + 5}px`;
    token.style.transition = "top 0.5s ease-in";
    token.style.zIndex = "100";
    
    board.appendChild(token);
    
    setTimeout(() => {
        token.style.top = `${cellRect.top - boardRect.top + 5}px`;
        
        setTimeout(() => {
            token.remove();
            callback();
        }, 550); 
    }, 50);
}

// Mettre à jour la grille après animation
function updateBoard() {
    let cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        let row = parseInt(cell.dataset.row);
        let col = parseInt(cell.dataset.col);
        if (grid[row][col] === "red") {
            cell.style.backgroundColor = "red";
        } else if (grid[row][col] === "yellow") {
            cell.style.backgroundColor = "yellow";
        } else {
            cell.style.backgroundColor = "lightgray";
        }
    });
}

// Annuler le dernier coup
function undoLastMove() {
    if (historiqueCoups.length === 0) return;
    if (gameOver) {
        gameOver = false;
        winnerMessage.textContent = "";
        winnerMessage.style.backgroundColor = "transparent";
        winnerMessage.style.border = "none";
    }

    let dernierCoup = historiqueCoups.pop();
    grid[dernierCoup.row][dernierCoup.col] = null; 
    updateBoard();
    currentPlayer = dernierCoup.player; 
    currentPlayerText.textContent = `Tour du joueur : ${currentPlayer}`;

}

// Victoire
function checkWin(row, col) {
    let directions = [
        { r: 1, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 1 }, { r: 1, c: -1 }
    ];

    for (let { r, c } of directions) {
        let count = 1;
        count += countInDirection(row, col, r, c);
        count += countInDirection(row, col, -r, -c);
        if (count >= 4) return true;
    }
    return false;
}

function countInDirection(row, col, rStep, cStep) {
    let count = 0;
    let color = grid[row][col];
    let r = row + rStep;
    let c = col + cStep;

    while (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === color) {
        count++;
        r += rStep;
        c += cStep;
    }
    return count;
}

// Match nul
function checkDraw() {
    return grid.every(row => row.every(cell => cell !== null));
}

// Mise à jour des scores
function updateScore(color) {
    if (color === "red") {
        scoreRouge++;
        document.getElementById("scoreRouge").textContent = scoreRouge;
    } else {
        scoreJaune++;
        document.getElementById("scoreJaune").textContent = scoreJaune;
    }
}
