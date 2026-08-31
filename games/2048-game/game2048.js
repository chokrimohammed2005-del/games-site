const gameBoard = document.querySelector("#gameBoard");
const scoreText = document.querySelector("#score");
const message = document.querySelector("#message");
const restartButton = document.querySelector("#restart");
const upBtn = document.querySelector("#upBtn");
const downBtn = document.querySelector("#downBtn");
const leftBtn = document.querySelector("#leftBtn");
const rightBtn = document.querySelector("#rightBtn");


// ==========================
// SOUNDS
// ==========================

const moveSound = new Audio("../../sounds/move.mp3");
const matchSound = new Audio("../../sounds/match.mp3");
const winSound = new Audio("../../sounds/win.mp3");
const loseSound = new Audio("../../sounds/lose.mp3");

function playSound(sound) {
    sound.currentTime = 0;

    sound.play().catch(function() {
        // ignore browser audio errors
    });
}


// ==========================
// GAME VARIABLES
// ==========================

let board = [];
let score = 0;

let mergedThisMove = false;
let alreadyWon = false;
let gameEnded = false;


// ==========================
// START GAME
// ==========================

function startGame() {

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    score = 0;

    mergedThisMove = false;
    alreadyWon = false;
    gameEnded = false;

    scoreText.textContent = "Score: 0";
    message.textContent = "";

    addRandomTile();
    addRandomTile();

    drawBoard();
}


// ==========================
// DRAW BOARD
// ==========================

function drawBoard() {

    gameBoard.innerHTML = "";

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            const value = board[row][col];

            const tile =
                document.createElement("div");

            tile.classList.add("tile");

            if (value !== 0) {

                tile.textContent = value;

                tile.classList.add(
                    "tile-" + value
                );
            }

            gameBoard.appendChild(tile);
        }
    }
}


// ==========================
// ADD RANDOM TILE
// ==========================

function addRandomTile() {

    const emptyCells = [];

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (board[row][col] === 0) {

                emptyCells.push({
                    row: row,
                    col: col
                });
            }
        }
    }

    if (emptyCells.length === 0) {
        return;
    }

    const randomCell =
        emptyCells[
            Math.floor(
                Math.random() *
                emptyCells.length
            )
        ];

    board[randomCell.row][randomCell.col] =
        Math.random() < 0.9 ? 2 : 4;
}


// ==========================
// MERGE LINE
// ==========================

function mergeLine(line) {

    let numbers =
        line.filter(function(number) {
            return number !== 0;
        });


    for (
        let i = 0;
        i < numbers.length - 1;
        i++
    ) {

        if (
            numbers[i] ===
            numbers[i + 1]
        ) {

            numbers[i] =
                numbers[i] * 2;

            score += numbers[i];

            numbers[i + 1] = 0;

            mergedThisMove = true;

            i++;
        }
    }


    numbers =
        numbers.filter(function(number) {
            return number !== 0;
        });


    while (numbers.length < 4) {
        numbers.push(0);
    }

    return numbers;
}


// ==========================
// FINISH MOVE
// ==========================

function finishMove(oldBoard) {

    const newBoard =
        JSON.stringify(board);


    if (oldBoard !== newBoard) {

        addRandomTile();

        scoreText.textContent =
            "Score: " + score;

        drawBoard();


        if (mergedThisMove) {

            playSound(matchSound);

        } else {

            playSound(moveSound);
        }


        checkWin();
        checkGameOver();
    }


    mergedThisMove = false;
}


// ==========================
// MOVE LEFT
// ==========================

function moveLeft() {

    if (gameEnded) {
        return;
    }

    mergedThisMove = false;

    const oldBoard =
        JSON.stringify(board);


    for (let row = 0; row < 4; row++) {

        board[row] =
            mergeLine(board[row]);
    }


    finishMove(oldBoard);
}


// ==========================
// MOVE RIGHT
// ==========================

function moveRight() {

    if (gameEnded) {
        return;
    }

    mergedThisMove = false;

    const oldBoard =
        JSON.stringify(board);


    for (let row = 0; row < 4; row++) {

        let line =
            [...board[row]];

        line.reverse();

        line = mergeLine(line);

        line.reverse();

        board[row] = line;
    }


    finishMove(oldBoard);
}


// ==========================
// MOVE UP
// ==========================

function moveUp() {

    if (gameEnded) {
        return;
    }

    mergedThisMove = false;

    const oldBoard =
        JSON.stringify(board);


    for (let col = 0; col < 4; col++) {

        let line = [];

        for (let row = 0; row < 4; row++) {

            line.push(
                board[row][col]
            );
        }


        line =
            mergeLine(line);


        for (let row = 0; row < 4; row++) {

            board[row][col] =
                line[row];
        }
    }


    finishMove(oldBoard);
}


// ==========================
// MOVE DOWN
// ==========================

function moveDown() {

    if (gameEnded) {
        return;
    }

    mergedThisMove = false;

    const oldBoard =
        JSON.stringify(board);


    for (let col = 0; col < 4; col++) {

        let line = [];

        for (let row = 0; row < 4; row++) {

            line.push(
                board[row][col]
            );
        }


        line.reverse();

        line =
            mergeLine(line);

        line.reverse();


        for (let row = 0; row < 4; row++) {

            board[row][col] =
                line[row];
        }
    }


    finishMove(oldBoard);
}


// ==========================
// CHECK WIN
// ==========================

function checkWin() {

    if (alreadyWon) {
        return;
    }


    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (
                board[row][col] >= 2048
            ) {

                message.textContent =
                    "🎉 You reached 2048!";

                alreadyWon = true;

                playSound(winSound);

                return;
            }
        }
    }
}


// ==========================
// CHECK GAME OVER
// ==========================

function checkGameOver() {

    for (let row = 0; row < 4; row++) {

        for (let col = 0; col < 4; col++) {

            if (board[row][col] === 0) {
                return;
            }


            if (
                col < 3 &&
                board[row][col] ===
                board[row][col + 1]
            ) {
                return;
            }


            if (
                row < 3 &&
                board[row][col] ===
                board[row + 1][col]
            ) {
                return;
            }
        }
    }


    gameEnded = true;

    message.textContent =
        "💀 Game Over!";

    playSound(loseSound);
}


// ==========================
// KEYBOARD
// ==========================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "ArrowLeft") {

            event.preventDefault();
            moveLeft();
        }

        if (event.key === "ArrowRight") {

            event.preventDefault();
            moveRight();
        }

        if (event.key === "ArrowUp") {

            event.preventDefault();
            moveUp();
        }

        if (event.key === "ArrowDown") {

            event.preventDefault();
            moveDown();
        }
    }
);


// ==========================
// BUTTONS
// ==========================

restartButton.addEventListener(
    "click",
    function() {

        startGame();
    }
);

upBtn.addEventListener(
    "click",
    moveUp
);

downBtn.addEventListener(
    "click",
    moveDown
);

leftBtn.addEventListener(
    "click",
    moveLeft
);

rightBtn.addEventListener(
    "click",
    moveRight
);


// ==========================
// START
// ==========================

startGame();