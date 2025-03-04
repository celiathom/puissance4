let rows, cols;
let board = document.getElementById("gameBoard");
let winnerMessage = document.getElementById("winnerMessage"); 
let currentPlayerText = document.getElementById("currentPlayer"); 
let modal = document.getElementById("sizeModal");
let grid = [];
let currentPlayer = "red";
let gameOver = false;

// Afficher la modale au chargement de la page
window.onload = function() {
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

    grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    modal.style.display = "none"; // Cacher le popup
    createGrid();
}

// Fonction pour générer la grille dynamiquement
function createGrid() {
    board.innerHTML = ""; 
    board.style.display = "grid";
    board.style.gridTemplateColumns = `repeat(${cols}, 50px)`;

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

// Fonction pour ajouter un jeton dans la colonne choisie avec animation
function dropToken(col) {
    if (gameOver) return;

    for (let row = rows - 1; row >= 0; row--) {
        if (!grid[row][col]) {
            grid[row][col] = currentPlayer;
            animateTokenDrop(row, col, currentPlayer);
            
            if (checkWin(row, col)) {
                winnerMessage.textContent = `${currentPlayer === "red" ? "ROUGE" : "JAUNE"} a gagné !`;
                winnerMessage.style.color = currentPlayer;
                gameOver = true;
                return;
            }

            if (checkDraw()) {
                winnerMessage.textContent = "MATCH nul !";
                winnerMessage.style.color = "blue";
                gameOver = true;
                return;
            }

            currentPlayer = currentPlayer === "red" ? "yellow" : "red";
            currentPlayerText.textContent = `Tour du joueur : ${currentPlayer === "red" ? "Rouge" : "Jaune"}`;
            return;
        }
    }
}

// Fonction pour animer la chute du jeton
function animateTokenDrop(row, col, color) {
    let cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
    let token = document.createElement("div");
    token.style.width = "50px";
    token.style.height = "50px";
    token.style.borderRadius = "50%";
    token.style.position = "absolute";
    token.style.backgroundColor = color;
    token.style.left = `${col * 55}px`;
    token.style.top = "-60px"; // Départ hors de la grille
    token.style.transition = "top 0.5s ease-in";

    board.appendChild(token);
    setTimeout(() => {
        token.style.top = `${row * 55}px`; // Atterrissage
    }, 50);
    
    setTimeout(() => {
        token.remove();
        updateBoard();
    }, 600); // Supprimer l'animation et afficher le jeton dans la grille
}

// Vérifier si la grille est remplie (match nul)
function checkDraw() {
    return grid.every(row => row.every(cell => cell !== null));
}

// Vérifier si un joueur a gagné
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

// Mise à jour de l'affichage de la grille
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

// Réinitialisation du jeu
function resetGame() {
    grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    currentPlayer = "red"; 
    gameOver = false; 
    winnerMessage.textContent = ""; 
    currentPlayerText.textContent = "Tour du joueur : Rouge"; 
    createGrid();
}

document.getElementById("resetButton").addEventListener("click", resetGame);
