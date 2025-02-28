let rows = 6;
let cols = 7;
let board = document.getElementById("gameBoard");
let winnerMessage = document.getElementById("winnerMessage"); // Récupère le message
let currentPlayerText = document.getElementById("currentPlayer"); // Affichage du joueur actuel
let grid = Array.from({ length: rows }, () => Array(cols).fill(null));
let currentPlayer = "red";
let gameOver = false;

function createGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", () => dropToken(col));
            board.appendChild(cell);
        }
    }
}

function dropToken(col) {
    if (gameOver) return;

    for (let row = rows - 1; row >= 0; row--) {
        if (!grid[row][col]) {
            grid[row][col] = currentPlayer;
            updateBoard();

            if (checkWin(row, col)) {
                winnerMessage.textContent = `${currentPlayer === "red" ? "ROUGE" : "JAUNE"} a gagné !`;
                winnerMessage.style.color = currentPlayer; // Change la couleur du texte en fonction du gagnant
                gameOver = true;
                return;
            }

            // Changer de joueur et mettre à jour l'affichage
            currentPlayer = currentPlayer === "red" ? "yellow" : "red";
            currentPlayerText.textContent = `Tour du joueur : ${currentPlayer === "red" ? "Rouge" : "Jaune"}`;
            return;
            
        }
    }
}

function checkWin(row, col) {
    return (
        checkDirection(row, col, 0, 1) ||  
        checkDirection(row, col, 1, 0) ||  
        checkDirection(row, col, 1, 1) ||  
        checkDirection(row, col, 1, -1)    
    );
}

function checkDirection(row, col, rowDir, colDir) {
    let count = 1;
    let color = grid[row][col];

    count += countInDirection(row, col, rowDir, colDir, color);
    count += countInDirection(row, col, -rowDir, -colDir, color);

    return count >= 4;
}

function countInDirection(row, col, rowDir, colDir, color) {
    let count = 0;
    let r = row + rowDir;
    let c = col + colDir;

    while (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === color) {
        count++;
        r += rowDir;
        c += colDir;
    }

    return count;
}

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

createGrid();

let resetButton = document.getElementById("resetButton"); // Récupère le bouton "Rejouer"

resetButton.addEventListener("click", function () {
    grid = Array.from({ length: rows }, () => Array(cols).fill(null)); // Réinitialise la grille
    currentPlayer = "red"; // Remet le joueur rouge au début
    gameOver = false; // Réactive le jeu
    winnerMessage.textContent = ""; // Efface le message de victoire
    currentPlayerText.textContent = "Tour du joueur : Rouge"; // Réinitialise l'affichage du joueur actuel

    // Réinitialise les couleurs des cellules
    let cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.style.backgroundColor = "lightgray";
    });
});
