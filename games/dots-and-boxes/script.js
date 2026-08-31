const gameBoard = document.querySelector("#gameBoard");

const turnText = document.querySelector("#turnText");
const message = document.querySelector("#message");

const score1Text = document.querySelector("#score1");
const score2Text = document.querySelector("#score2");

const player1Box = document.querySelector("#player1Box");
const player2Box = document.querySelector("#player2Box");

const restartButton = document.querySelector("#restart");


// ==========================
// SOUNDS
// ==========================

const clickSound =
    new Audio("../../sounds/click.mp3");

const matchSound =
    new Audio("../../sounds/match.mp3");

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

const gridSize = 5;

let currentPlayer = 1;

let score1 = 0;
let score2 = 0;

let horizontalLines = [];
let verticalLines = [];
let boxes = [];

let gameOver = false;


// ==========================
// START GAME
// ==========================

function startGame() {

    currentPlayer = 1;

    score1 = 0;
    score2 = 0;

    gameOver = false;

    message.textContent = "";

    score1Text.textContent = "0";
    score2Text.textContent = "0";


    horizontalLines = [];

    for (let row = 0; row < gridSize; row++) {

        horizontalLines[row] = [];

        for (let col = 0; col < gridSize - 1; col++) {

            horizontalLines[row][col] = 0;
        }
    }


    verticalLines = [];

    for (let row = 0; row < gridSize - 1; row++) {

        verticalLines[row] = [];

        for (let col = 0; col < gridSize; col++) {

            verticalLines[row][col] = 0;
        }
    }


    boxes = [];

    for (let row = 0; row < gridSize - 1; row++) {

        boxes[row] = [];

        for (let col = 0; col < gridSize - 1; col++) {

            boxes[row][col] = 0;
        }
    }


    updateTurn();
    drawBoard();
}


// ==========================
// DRAW BOARD
// ==========================

function drawBoard() {

    gameBoard.innerHTML = "";

    const gap =
        100 / (gridSize - 1);


    // BOXES
    for (let row = 0; row < gridSize - 1; row++) {

        for (let col = 0; col < gridSize - 1; col++) {

            const box =
                document.createElement("div");

            box.classList.add("box");


            box.style.left =
                (col * gap + 2) + "%";

            box.style.top =
                (row * gap + 2) + "%";

            box.style.width =
                (gap - 4) + "%";

            box.style.height =
                (gap - 4) + "%";


            if (boxes[row][col] === 1) {

                box.classList.add(
                    "player1",
                    "completed"
                );

                box.textContent = "1";
            }


            if (boxes[row][col] === 2) {

                box.classList.add(
                    "player2",
                    "completed"
                );

                box.textContent = "2";
            }


            gameBoard.appendChild(box);
        }
    }


    // HORIZONTAL LINES
    for (let row = 0; row < gridSize; row++) {

        for (let col = 0; col < gridSize - 1; col++) {

            const line =
                document.createElement("button");

            line.classList.add(
                "line",
                "horizontal"
            );


            line.style.left =
                (col * gap) + "%";

            line.style.top =
                (row * gap) + "%";

            line.style.width =
                gap + "%";


            const owner =
                horizontalLines[row][col];


            if (owner === 1) {
                line.classList.add("player1");
            }


            if (owner === 2) {
                line.classList.add("player2");
            }


            line.addEventListener(
                "click",
                function() {

                    playHorizontal(
                        row,
                        col
                    );
                }
            );


            gameBoard.appendChild(line);
        }
    }


    // VERTICAL LINES
    for (let row = 0; row < gridSize - 1; row++) {

        for (let col = 0; col < gridSize; col++) {

            const line =
                document.createElement("button");

            line.classList.add(
                "line",
                "vertical"
            );


            line.style.left =
                (col * gap) + "%";

            line.style.top =
                (row * gap) + "%";

            line.style.height =
                gap + "%";


            const owner =
                verticalLines[row][col];


            if (owner === 1) {
                line.classList.add("player1");
            }


            if (owner === 2) {
                line.classList.add("player2");
            }


            line.addEventListener(
                "click",
                function() {

                    playVertical(
                        row,
                        col
                    );
                }
            );


            gameBoard.appendChild(line);
        }
    }


    // DOTS
    for (let row = 0; row < gridSize; row++) {

        for (let col = 0; col < gridSize; col++) {

            const dot =
                document.createElement("div");

            dot.classList.add("dot");


            dot.style.left =
                (col * gap) + "%";

            dot.style.top =
                (row * gap) + "%";


            gameBoard.appendChild(dot);
        }
    }
}


// ==========================
// HORIZONTAL PLAY
// ==========================

function playHorizontal(row, col) {

    if (gameOver) {
        return;
    }


    if (
        horizontalLines[row][col] !== 0
    ) {
        return;
    }


    horizontalLines[row][col] =
        currentPlayer;


    playSound(clickSound);


    const completedBox =
        checkCompletedBoxes();


    if (completedBox) {

        playSound(matchSound);

    } else {

        switchPlayer();
    }


    checkGameOver();

    drawBoard();
}


// ==========================
// VERTICAL PLAY
// ==========================

function playVertical(row, col) {

    if (gameOver) {
        return;
    }


    if (
        verticalLines[row][col] !== 0
    ) {
        return;
    }


    verticalLines[row][col] =
        currentPlayer;


    playSound(clickSound);


    const completedBox =
        checkCompletedBoxes();


    if (completedBox) {

        playSound(matchSound);

    } else {

        switchPlayer();
    }


    checkGameOver();

    drawBoard();
}


// ==========================
// CHECK BOXES
// ==========================

function checkCompletedBoxes() {

    let completedSomething = false;


    for (let row = 0; row < gridSize - 1; row++) {

        for (let col = 0; col < gridSize - 1; col++) {

            if (boxes[row][col] !== 0) {
                continue;
            }


            const top =
                horizontalLines[row][col];

            const bottom =
                horizontalLines[row + 1][col];

            const left =
                verticalLines[row][col];

            const right =
                verticalLines[row][col + 1];


            if (
                top !== 0 &&
                bottom !== 0 &&
                left !== 0 &&
                right !== 0
            ) {

                boxes[row][col] =
                    currentPlayer;


                completedSomething = true;


                if (currentPlayer === 1) {

                    score1++;

                    score1Text.textContent =
                        score1;

                } else {

                    score2++;

                    score2Text.textContent =
                        score2;
                }
            }
        }
    }


    return completedSomething;
}


// ==========================
// SWITCH PLAYER
// ==========================

function switchPlayer() {

    if (currentPlayer === 1) {

        currentPlayer = 2;

    } else {

        currentPlayer = 1;
    }


    updateTurn();
}


// ==========================
// UPDATE TURN
// ==========================

function updateTurn() {

    if (currentPlayer === 1) {

        turnText.textContent =
            "Player 1 Turn";

        player1Box.classList.add(
            "active"
        );

        player2Box.classList.remove(
            "active"
        );

    } else {

        turnText.textContent =
            "Player 2 Turn";

        player2Box.classList.add(
            "active"
        );

        player1Box.classList.remove(
            "active"
        );
    }
}


// ==========================
// GAME OVER
// ==========================

function checkGameOver() {

    const totalBoxes =
        (gridSize - 1) *
        (gridSize - 1);


    if (
        score1 + score2 <
        totalBoxes
    ) {
        return;
    }


    gameOver = true;


    if (score1 > score2) {

        message.textContent =
            "🏆 Player 1 Wins!";

        turnText.textContent =
            "Game Finished";

        playSound(winSound);

    } else if (score2 > score1) {

        message.textContent =
            "🏆 Player 2 Wins!";

        turnText.textContent =
            "Game Finished";

        playSound(winSound);

    } else {

        message.textContent =
            "🤝 Draw!";

        turnText.textContent =
            "Game Finished";

        playSound(drawSound);
    }
}


// ==========================
// RESTART
// ==========================

restartButton.addEventListener(
    "click",
    function() {

        playSound(clickSound);

        startGame();
    }
);


// ==========================
// START
// ==========================

startGame();