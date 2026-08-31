const searchInput = document.querySelector("#gameSearch");
const gameCards = document.querySelectorAll(".game-card");

searchInput.addEventListener("input", function() {

    const searchValue = searchInput.value.toLowerCase();

    gameCards.forEach(function(card) {

        const gameName = card
            .querySelector("h2")
            .textContent
            .toLowerCase();

        if (gameName.includes(searchValue)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});