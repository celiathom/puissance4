let rows, cols;
let board = document.getElementById("gameBoard");
let winnerMessage = document.getElementById("winnerMessage");
let currentPlayerText = document.getElementById("currentPlayer");
let sizeModal = document.getElementById("sizeModal");
let nameModal = document.getElementById("nameModal");
let validateButton = document.getElementById("validateNames");
let startButton = document.getElementById("startGame");
let resetButton = document.getElementById("resetButton");

let grid = [];
let currentPlayer = "red";
let gameOver = false;
let scoreRouge = 0;
let scoreJaune = 0;

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

    grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    sizeModal.style.display = "none";
    nameModal.style.display = "flex";
}

// ✅ Fonction pour valider les noms et afficher la grille
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

// ✅ Fonction pour générer la grille
function createGrid() {
    board.innerHTML = "";
    board.style.display = "grid";

    let cellSize = Math.min(500 / cols, 500 / rows);
    board.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;

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

// ✅ Fonction pour ajouter un jeton et vérifier la victoire
function dropToken(col) {
    if (gameOver) return;

    for (let row = rows - 1; row >= 0; row--) {
        if (!grid[row][col]) {
            animateTokenDrop(row, col, currentPlayer);

            grid[row][col] = currentPlayer; // Enregistre le coup dans la grille

            // ✅ Vérifier si ce coup mène à la victoire
            if (checkWin(row, col)) {
                winnerMessage.textContent = `${currentPlayer === "red" ? "ROUGE" : "JAUNE"} a gagné !`;
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
            currentPlayerText.textContent = `Tour du joueur : ${currentPlayer === "red" ? "Rouge" : "Jaune"}`;
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
    let cell = document.querySelector("[data-row='0'][data-col='0']");
    let cellSize = cell ? cell.offsetWidth : 50;

    let token = document.createElement("div");

    token.style.width = `${cellSize}px`;
    token.style.height = `${cellSize}px`;
    token.style.borderRadius = "50%";
    token.style.position = "absolute";
    token.style.backgroundColor = color;
    token.style.left = `${col * cellSize}px`;
    token.style.top = "-60px";
    token.style.transition = "top 0.6s ease-in";

    board.appendChild(token);

    setTimeout(() => {
        token.style.top = `${row * cellSize}px`;
    }, 50);

    setTimeout(() => {
        token.remove();
        updateBoard();
    }, 700);
}

// ✅ Mise à jour de la grille
function updateBoard() {
    let cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        let row = cell.dataset.row;
        let col = cell.dataset.col;
        if (grid[row][col] === "red") {
            cell.style.backgroundColor = "red";
        } else if (grid[row][col] === "yellow") {
            cell.style.backgroundColor = "yellow";
        }
    });
}

// ✅ Vérifier la victoire
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

// ✅ Vérifier match nul
function checkDraw() {
    return grid.every(row => row.every(cell => cell !== null));
}

// ✅ Réinitialiser le jeu SANS remettre les scores à zéro
function resetGame() {
    grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    gameOver = false;
    currentPlayer = "red";
    winnerMessage.textContent = "";
    currentPlayerText.textContent = "Tour du joueur : Rouge";
    createGrid();
}
