const choices = document.querySelectorAll(".choice");

const turnText = document.querySelector("#turnText");

const player1ChoiceText =
    document.querySelector("#player1Choice");

const player2ChoiceText =
    document.querySelector("#player2Choice");

const message =
    document.querySelector("#message");

const score1Text =
    document.querySelector("#score1");

const score2Text =
    document.querySelector("#score2");

const restartButton =
    document.querySelector("#restart");

const resetScoreButton =
    document.querySelector("#resetScore");


// ==========================
// SOUNDS
// ==========================

const clickSound =
    new Audio("../../sounds/click.mp3");

const winSound =
    new Audio("../../sounds/win.mp3");

const drawSound =
    new Audio("../../sounds/draw.mp3");


function playSound(sound) {

    sound.currentTime = 0;

    sound.play().catch(function() {
        // ignore browser audio errors
    });
}


// ==========================
// GAME VARIABLES
// ==========================

let currentPlayer = 1;

let player1Choice = null;
let player2Choice = null;

let score1 = 0;
let score2 = 0;

let roundOver = false;


// ==========================
// CHOICE CLICK
// ==========================

choices.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            if (roundOver === true) {
                return;
            }


            playSound(clickSound);


            const selectedChoice =
                button.dataset.choice;


            // PLAYER 1
            if (currentPlayer === 1) {

                player1Choice =
                    selectedChoice;


                player1ChoiceText.textContent =
                    "Player 1: 🔒 Choice hidden";


                turnText.textContent =
                    "Player 2 - Choose your move";


                currentPlayer = 2;

                return;
            }


            // PLAYER 2
            player2Choice =
                selectedChoice;


            player2ChoiceText.textContent =
                "Player 2: " +
                getEmoji(player2Choice);


            player1ChoiceText.textContent =
                "Player 1: " +
                getEmoji(player1Choice);


            checkWinner();
        }
    );
});


// ==========================
// EMOJIS
// ==========================

function getEmoji(choice) {

    if (choice === "rock") {
        return "✊ Rock";
    }

    if (choice === "paper") {
        return "✋ Paper";
    }

    if (choice === "scissors") {
        return "✌️ Scissors";
    }
}


// ==========================
// WINNER
// ==========================

function checkWinner() {

    roundOver = true;


    if (
        player1Choice ===
        player2Choice
    ) {

        message.textContent =
            "🤝 Draw!";


        turnText.textContent =
            "Round finished";


        playSound(drawSound);

        return;
    }


    const player1Wins =
        (
            player1Choice === "rock" &&
            player2Choice === "scissors"
        )
        ||
        (
            player1Choice === "paper" &&
            player2Choice === "rock"
        )
        ||
        (
            player1Choice === "scissors" &&
            player2Choice === "paper"
        );


    if (player1Wins) {

        score1++;

        score1Text.textContent =
            score1;

        message.textContent =
            "🎉 Player 1 Wins!";

    } else {

        score2++;

        score2Text.textContent =
            score2;

        message.textContent =
            "🎉 Player 2 Wins!";
    }


    playSound(winSound);


    turnText.textContent =
        "Round finished";
}


// ==========================
// RESTART ROUND
// ==========================

restartButton.addEventListener(
    "click",
    function() {

        playSound(clickSound);


        currentPlayer = 1;

        player1Choice = null;
        player2Choice = null;

        roundOver = false;


        player1ChoiceText.textContent =
            "Player 1: ?";


        player2ChoiceText.textContent =
            "Player 2: ?";


        message.textContent = "";


        turnText.textContent =
            "Player 1 - Choose your move";
    }
);


// ==========================
// RESET SCORE
// ==========================

resetScoreButton.addEventListener(
    "click",
    function() {

        playSound(clickSound);


        score1 = 0;
        score2 = 0;


        score1Text.textContent = "0";
        score2Text.textContent = "0";


        currentPlayer = 1;

        player1Choice = null;
        player2Choice = null;

        roundOver = false;


        player1ChoiceText.textContent =
            "Player 1: ?";


        player2ChoiceText.textContent =
            "Player 2: ?";


        message.textContent = "";


        turnText.textContent =
            "Player 1 - Choose your move";
    }
);