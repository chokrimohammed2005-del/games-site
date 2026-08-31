const gameBoard = document.querySelector("#gameBoard");

const turnText = document.querySelector("#turnText");
const message = document.querySelector("#message");

const score1Text = document.querySelector("#score1");
const score2Text = document.querySelector("#score2");

const restartButton = document.querySelector("#restart");
const resetScoreButton = document.querySelector("#resetScore");


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

const rows = 6;
const cols = 7;

let board = [];

let currentPlayer = 1;

let gameOver = false;

let score1 = 0;
let score2 = 0;


// ==========================
// START ROUND
// ==========================

function startRound() {

    board = [];

    currentPlayer = 1;

    gameOver = false;

    message.textContent = "";

    turnText.textContent =
        "Player 1 Turn";


    for (let row = 0; row < rows; row++) {

        board[row] = [];

        for (let col = 0; col < cols; col++) {

            board[row][col] = 0;
        }
    }


    drawBoard();
}


// ==========================
// DRAW BOARD
// ==========================

function drawBoard() {

    gameBoard.innerHTML = "";


    for (let row = 0; row < rows; row++) {

        for (let col = 0; col < cols; col++) {

            const cell =
                document.createElement("button");

            cell.classList.add("cell");

            cell.dataset.row = row;
            cell.dataset.col = col;


            if (board[row][col] === 1) {

                cell.classList.add("player1");
            }


            if (board[row][col] === 2) {

                cell.classList.add("player2");
            }


            cell.addEventListener(
                "click",
                function() {

                    playColumn(col);
                }
            );


            gameBoard.appendChild(cell);
        }
    }
}


// ==========================
// PLAY COLUMN
// ==========================

function playColumn(col) {

    if (gameOver === true) {
        return;
    }


    let targetRow = -1;


    for (let row = rows - 1; row >= 0; row--) {

        if (board[row][col] === 0) {

            targetRow = row;

            break;
        }
    }


    if (targetRow === -1) {

        message.textContent =
            "Had column 3amra!";

        return;
    }


    board[targetRow][col] =
        currentPlayer;


    playSound(clickSound);


    drawBoard();


    const index =
        targetRow * cols + col;

    const cells =
        document.querySelectorAll(".cell");

    cells[index].classList.add("drop");


    if (
        checkWinner(
            targetRow,
            col,
            currentPlayer
        )
    ) {

        gameOver = true;


        if (currentPlayer === 1) {

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


        turnText.textContent =
            "Round Finished";


        playSound(winSound);


        return;
    }


    if (checkDraw()) {

        gameOver = true;

        message.textContent =
            "🤝 Draw!";

        turnText.textContent =
            "Round Finished";


        playSound(drawSound);


        return;
    }


    switchPlayer();
}


// ==========================
// SWITCH PLAYER
// ==========================

function switchPlayer() {

    if (currentPlayer === 1) {

        currentPlayer = 2;

        turnText.textContent =
            "Player 2 Turn";

    } else {

        currentPlayer = 1;

        turnText.textContent =
            "Player 1 Turn";
    }
}


// ==========================
// CHECK WINNER
// ==========================

function checkWinner(row, col, player) {

    if (
        countPieces(row, col, 0, 1, player) >= 4
    ) {
        return true;
    }


    if (
        countPieces(row, col, 1, 0, player) >= 4
    ) {
        return true;
    }


    if (
        countPieces(row, col, 1, 1, player) >= 4
    ) {
        return true;
    }


    if (
        countPieces(row, col, 1, -1, player) >= 4
    ) {
        return true;
    }


    return false;
}


// ==========================
// COUNT PIECES
// ==========================

function countPieces(
    row,
    col,
    rowDirection,
    colDirection,
    player
) {

    let count = 1;


    let r =
        row + rowDirection;

    let c =
        col + colDirection;


    while (
        r >= 0 &&
        r < rows &&
        c >= 0 &&
        c < cols &&
        board[r][c] === player
    ) {

        count++;

        r += rowDirection;
        c += colDirection;
    }


    r =
        row - rowDirection;

    c =
        col - colDirection;


    while (
        r >= 0 &&
        r < rows &&
        c >= 0 &&
        c < cols &&
        board[r][c] === player
    ) {

        count++;

        r -= rowDirection;
        c -= colDirection;
    }


    return count;
}


// ==========================
// DRAW
// ==========================

function checkDraw() {

    for (let col = 0; col < cols; col++) {

        if (board[0][col] === 0) {

            return false;
        }
    }


    return true;
}


// ==========================
// RESTART ROUND
// ==========================

restartButton.addEventListener(
    "click",
    function() {

        playSound(clickSound);

        startRound();
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

        startRound();
    }
);


// ==========================
// START
// ==========================

startRound();