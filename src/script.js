let rows, cols;
let board = document.getElementById("gameBoard");
let winnerMessage = document.getElementById("winnerMessage"); 
let currentPlayerText = document.getElementById("currentPlayer"); 
let sizeModal = document.getElementById("sizeModal");
let nameModal = document.getElementById("nameModal");
let validateButton = document.getElementById("validateNames");
let startButton = document.getElementById("startGame");

let grid = [];
let currentPlayer = "red";
let gameOver = false;
let scoreRouge = 0;
let scoreJaune = 0;

// Afficher la première modale (taille de la grille) au chargement
window.onload = function() {
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

    grid = Array.from({ length: rows }, () => Array(cols).fill(null));
    sizeModal.style.display = "none"; // Cacher la pop-up des dimensions
    nameModal.style.display = "flex"; // Afficher la pop-up des prénoms
}

// Vérifier et stocker les prénoms des joueurs
validateButton.addEventListener("click", function () {
    const playerRed = document.getElementById("playerRed").value.trim();
    const playerYellow = document.getElementById("playerYellow").value.trim();

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

    let cellSize = cols > 15 || rows > 15 ? 30 : 50;
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

// Gestion du bouton "Démarrer"
startButton.addEventListener("click", startGame);

// Fonction pour ajouter un jeton dans la colonne choisie avec animation
function dropToken(col) {
    if (gameOver) return;

    for (let row = rows - 1; row >= 0; row--) {
        if (!grid[row][col]) {
            grid[row][col] = currentPlayer; // Place le jeton dans la grille
            animateTokenDrop(row, col, currentPlayer); // Animation du jeton qui tombe

            if (checkWin(row, col)) {
                winnerMessage.textContent = `${currentPlayer === "red" ? "ROUGE" : "JAUNE"} a gagné !`;
                winnerMessage.style.color = currentPlayer;
                gameOver = true;
                mettreAJourScore(currentPlayer);
                return;
            }

            if (checkDraw()) {
                winnerMessage.textContent = "MATCH NUL !";
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
    let cellSize = cols > 15 || rows > 15 ? 30 : 50; // Ajustement de la taille
    let token = document.createElement("div");

    token.classList.add("falling"); // Classe CSS pour animation
    token.style.width = `${cellSize}px`;
    token.style.height = `${cellSize}px`;
    token.style.borderRadius = "50%";
    token.style.position = "absolute";
    token.style.backgroundColor = color;
    token.style.left = `${col * (cellSize + 5)}px`;
    token.style.top = "-60px";
    token.style.transition = "top 0.5s ease-in";

    board.appendChild(token);
    setTimeout(() => {
        token.style.top = `${row * (cellSize + 5)}px`; 
    }, 50);
    
    setTimeout(() => {
        token.remove();
        updateBoard(); // Met à jour la grille après l'animation
    }, 600);
}

// Mise à jour de l'affichage de la grille après animation
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

// Fonction pour ajouter un jeton dans la colonne choisie avec animation
function dropToken(col) {
    if (gameOver) return;

    for (let row = rows - 1; row >= 0; row--) {
        if (!grid[row][col]) {
            grid[row][col] = currentPlayer; // Place le jeton dans la grille
            animateTokenDrop(row, col, currentPlayer); // Animation du jeton qui tombe

            if (checkWin(row, col)) {
                winnerMessage.textContent = `${currentPlayer === "red" ? "ROUGE" : "JAUNE"} a gagné !`;
                winnerMessage.style.color = currentPlayer;
                gameOver = true;
                mettreAJourScore(currentPlayer);
                return;
            }

            if (checkDraw()) {
                winnerMessage.textContent = "MATCH NUL !";
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
    let cellSize = cols > 15 || rows > 15 ? 30 : 50; // Ajustement de la taille
    let token = document.createElement("div");

    token.classList.add("falling"); // Classe CSS pour animation
    token.style.width = `${cellSize}px`;
    token.style.height = `${cellSize}px`;
    token.style.borderRadius = "50%";
    token.style.position = "absolute";
    token.style.backgroundColor = color;
    token.style.left = `${col * (cellSize + 5)}px`;
    token.style.top = "-60px";
    token.style.transition = "top 0.5s ease-in";

    board.appendChild(token);
    setTimeout(() => {
        token.style.top = `${row * (cellSize + 5)}px`; 
    }, 50);
    
    setTimeout(() => {
        token.remove();
        updateBoard(); // Met à jour la grille après l'animation
    }, 600);
}

// Mise à jour de l'affichage de la grille après animation
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

