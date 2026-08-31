const checkersBoard = document.querySelector("#checkersBoard");
const turnText = document.querySelector("#turnText");
const message = document.querySelector("#message");

const redPlayer = document.querySelector("#redPlayer");
const blackPlayer = document.querySelector("#blackPlayer");

const restartButton = document.querySelector("#restart");


// ==========================
// SOUNDS
// ==========================

const moveSound =
    new Audio("../../sounds/move.mp3");

const hitSound =
    new Audio("../../sounds/hit.mp3");

const winSound =
    new Audio("../../sounds/win.mp3");

const clickSound =
    new Audio("../../sounds/click.mp3");


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
let currentPlayer = "red";

let selected = null;
let validMoves = [];

let gameOver = false;


// ==========================
// START GAME
// ==========================

function startGame() {

    board = [];

    for (let row = 0; row < 8; row++) {

        board[row] = [];

        for (let col = 0; col < 8; col++) {

            board[row][col] = null;
        }
    }


    // BLACK PIECES
    for (let row = 0; row < 3; row++) {

        for (let col = 0; col < 8; col++) {

            if ((row + col) % 2 === 1) {

                board[row][col] = {
                    color: "black",
                    king: false
                };
            }
        }
    }


    // RED PIECES
    for (let row = 5; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            if ((row + col) % 2 === 1) {

                board[row][col] = {
                    color: "red",
                    king: false
                };
            }
        }
    }


    currentPlayer = "red";

    selected = null;
    validMoves = [];

    gameOver = false;

    message.textContent = "";

    updateTurn();

    drawBoard();
}


// ==========================
// DRAW BOARD
// ==========================

function drawBoard() {

    checkersBoard.innerHTML = "";


    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const square =
                document.createElement("button");

            square.classList.add("square");


            if ((row + col) % 2 === 0) {
                square.classList.add("light");
            } else {
                square.classList.add("dark");
            }


            if (
                selected &&
                selected.row === row &&
                selected.col === col
            ) {

                square.classList.add("selected");
            }


            const move =
                validMoves.find(function(m) {

                    return (
                        m.row === row &&
                        m.col === col
                    );
                });


            if (move) {

                if (move.capture) {
                    square.classList.add("capture-move");
                } else {
                    square.classList.add("valid-move");
                }
            }


            const piece =
                board[row][col];


            if (piece) {

                const pieceDiv =
                    document.createElement("div");

                pieceDiv.classList.add(
                    "checker-piece"
                );


                if (piece.color === "red") {

                    pieceDiv.classList.add(
                        "red-piece"
                    );

                } else {

                    pieceDiv.classList.add(
                        "black-piece"
                    );
                }


                if (piece.king) {

                    pieceDiv.classList.add(
                        "king"
                    );
                }


                square.appendChild(pieceDiv);
            }


            square.addEventListener(
                "click",
                function() {

                    handleClick(row, col);
                }
            );


            checkersBoard.appendChild(square);
        }
    }
}


// ==========================
// CLICK
// ==========================

function handleClick(row, col) {

    if (gameOver) {
        return;
    }


    const piece =
        board[row][col];


    // SELECT PIECE
    if (
        piece &&
        piece.color === currentPlayer
    ) {

        selected = {
            row: row,
            col: col
        };

        validMoves =
            getMoves(
                row,
                col,
                piece
            );

        drawBoard();

        return;
    }


    if (!selected) {
        return;
    }


    const move =
        validMoves.find(function(m) {

            return (
                m.row === row &&
                m.col === col
            );
        });


    if (!move) {

        selected = null;
        validMoves = [];

        drawBoard();

        return;
    }


    movePiece(
        selected.row,
        selected.col,
        row,
        col,
        move
    );
}


// ==========================
// MOVE PIECE
// ==========================

function movePiece(
    fromRow,
    fromCol,
    toRow,
    toCol,
    move
) {

    const piece =
        board[fromRow][fromCol];


    board[toRow][toCol] =
        piece;

    board[fromRow][fromCol] =
        null;


    // ==========================
    // CAPTURE
    // ==========================

    if (move.capture) {

        board[
            move.capture.row
        ][
            move.capture.col
        ] = null;


        playSound(hitSound);

    } else {

        playSound(moveSound);
    }


    // ==========================
    // KING
    // ==========================

    if (
        piece.color === "red" &&
        toRow === 0
    ) {

        piece.king = true;
    }


    if (
        piece.color === "black" &&
        toRow === 7
    ) {

        piece.king = true;
    }


    selected = null;
    validMoves = [];


    checkWinner();


    if (!gameOver) {

        switchPlayer();
    }


    drawBoard();
}


// ==========================
// GET MOVES
// ==========================

function getMoves(
    row,
    col,
    piece
) {

    const moves = [];


    let directions = [];


    if (
        piece.color === "red" ||
        piece.king
    ) {

        directions.push(
            [-1, -1],
            [-1, 1]
        );
    }


    if (
        piece.color === "black" ||
        piece.king
    ) {

        directions.push(
            [1, -1],
            [1, 1]
        );
    }


    directions.forEach(
        function(direction) {

            const row1 =
                row + direction[0];

            const col1 =
                col + direction[1];


            // NORMAL MOVE
            if (
                isInside(row1, col1) &&
                board[row1][col1] === null
            ) {

                moves.push({
                    row: row1,
                    col: col1,
                    capture: null
                });
            }


            // CAPTURE
            if (
                isInside(row1, col1) &&
                board[row1][col1] !== null &&
                board[row1][col1].color !== piece.color
            ) {

                const row2 =
                    row + direction[0] * 2;

                const col2 =
                    col + direction[1] * 2;


                if (
                    isInside(row2, col2) &&
                    board[row2][col2] === null
                ) {

                    moves.push({
                        row: row2,
                        col: col2,

                        capture: {
                            row: row1,
                            col: col1
                        }
                    });
                }
            }
        }
    );


    return moves;
}


// ==========================
// WINNER
// ==========================

function checkWinner() {

    let redCount = 0;
    let blackCount = 0;


    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece =
                board[row][col];


            if (!piece) {
                continue;
            }


            if (piece.color === "red") {
                redCount++;
            }


            if (piece.color === "black") {
                blackCount++;
            }
        }
    }


    if (redCount === 0) {

        gameOver = true;

        message.textContent =
            "🏆 Black Wins!";

        turnText.textContent =
            "Game Finished";

        playSound(winSound);
    }


    if (blackCount === 0) {

        gameOver = true;

        message.textContent =
            "🏆 Red Wins!";

        turnText.textContent =
            "Game Finished";

        playSound(winSound);
    }
}


// ==========================
// SWITCH PLAYER
// ==========================

function switchPlayer() {

    if (currentPlayer === "red") {

        currentPlayer = "black";

    } else {

        currentPlayer = "red";
    }


    updateTurn();
}


// ==========================
// TURN UI
// ==========================

function updateTurn() {

    if (currentPlayer === "red") {

        turnText.textContent =
            "Red Turn";

        redPlayer.classList.add(
            "active"
        );

        blackPlayer.classList.remove(
            "active"
        );

    } else {

        turnText.textContent =
            "Black Turn";

        blackPlayer.classList.add(
            "active"
        );

        redPlayer.classList.remove(
            "active"
        );
    }
}


// ==========================
// HELPER
// ==========================

function isInside(row, col) {

    return (
        row >= 0 &&
        row < 8 &&
        col >= 0 &&
        col < 8
    );
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