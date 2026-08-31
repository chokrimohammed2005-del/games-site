const memoryGrid = document.querySelector("#memoryGrid");
const movesText = document.querySelector("#moves");
const message = document.querySelector("#message");
const restartButton = document.querySelector("#restart");


// ==========================
// SOUNDS
// ==========================

const clickSound = new Audio("../../sounds/click.mp3");
const matchSound = new Audio("../../sounds/match.mp3");
const winSound = new Audio("../../sounds/win.mp3");

function playSound(sound) {
    sound.currentTime = 0;

    sound.play().catch(function() {
        // ignore browser audio errors
    });
}


// ==========================
// SYMBOLS
// ==========================

const symbols = [
    "🍎", "🍌", "🍇", "🍓",
    "🍉", "🍒", "🥝", "🍍",
    "🐶", "🐱", "🐼", "🦁"
];

let cards = [];

let firstCard = null;
let secondCard = null;

let lockBoard = true;

let moves = 0;
let matchedPairs = 0;


// ==========================
// START GAME
// ==========================

function startGame() {

    memoryGrid.innerHTML = "";

    moves = 0;
    matchedPairs = 0;

    firstCard = null;
    secondCard = null;

    lockBoard = true;

    movesText.textContent = "Moves: 0";
    message.textContent = "";


    cards = [...symbols, ...symbols];


    cards.sort(function() {
        return Math.random() - 0.5;
    });


    cards.forEach(function(symbol) {

        const card = document.createElement("button");

        card.classList.add("memory-item");

        card.dataset.symbol = symbol;


        card.textContent = symbol;

        card.classList.add("flipped");


        card.addEventListener("click", function() {

            flipCard(card);
        });


        memoryGrid.appendChild(card);
    });


    setTimeout(function() {

        const allCards =
            document.querySelectorAll(".memory-item");


        allCards.forEach(function(card) {

            card.textContent = "?";

            card.classList.remove("flipped");
        });


        lockBoard = false;

    }, 2000);
}


// ==========================
// FLIP CARD
// ==========================

function flipCard(card) {

    if (lockBoard === true) {
        return;
    }

    if (card === firstCard) {
        return;
    }

    if (card.classList.contains("matched")) {
        return;
    }


    playSound(clickSound);


    card.textContent =
        card.dataset.symbol;

    card.classList.add("flipped");


    if (firstCard === null) {

        firstCard = card;

        return;
    }


    secondCard = card;

    moves++;

    movesText.textContent =
        "Moves: " + moves;


    checkMatch();
}


// ==========================
// CHECK MATCH
// ==========================

function checkMatch() {

    if (
        firstCard.dataset.symbol ===
        secondCard.dataset.symbol
    ) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matchedPairs++;


        playSound(matchSound);


        resetTurn();


        if (matchedPairs === symbols.length) {

            message.textContent =
                "🎉 Bravo! Kmlti lgame f " +
                moves +
                " moves!";

            playSound(winSound);
        }

    } else {

        lockBoard = true;


        setTimeout(function() {

            firstCard.textContent = "?";
            secondCard.textContent = "?";

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");


            resetTurn();

        }, 800);
    }
}


// ==========================
// RESET TURN
// ==========================

function resetTurn() {

    firstCard = null;
    secondCard = null;

    lockBoard = false;
}


// ==========================
// RESTART GAME
// ==========================

restartButton.addEventListener("click", function() {

    playSound(clickSound);

    startGame();
});


// ==========================
// START
// ==========================

startGame();