document.addEventListener("DOMContentLoaded", function () {
    const nameModal = document.getElementById("nameModal");
    const validateButton = document.getElementById("validateNames");

    // Afficher la pop-up des prénoms après celle des dimensions
    function showNameModal() {
        nameModal.style.display = "flex";
    }

    // Vérifier et stocker les prénoms
    validateButton.addEventListener("click", function () {
        const player1 = document.getElementById("player1").value.trim();
        const player2 = document.getElementById("player2").value.trim();

        if (player1 === "" || player2 === "") {
            alert("Veuillez entrer les prénoms des deux joueurs !");
            return;
        }

        // Stocker les noms pour utilisation dans le jeu
        localStorage.setItem("player1", player1);
        localStorage.setItem("player2", player2);

        // Fermer la pop-up
        nameModal.style.display = "none";

        // Afficher les noms des joueurs dans le jeu (à adapter selon ton HTML)
        document.getElementById("displayPlayer1").textContent = player1;
        document.getElementById("displayPlayer2").textContent = player2;
    });

    // Après la pop-up des dimensions, afficher celle des prénoms
    // Tu dois appeler `showNameModal()` à la fin du traitement de ta première pop-up
});
