const chessBoard = document.querySelector("#chessBoard");
const turnText = document.querySelector("#turnText");
const message = document.querySelector("#message");

const whitePlayer = document.querySelector("#whitePlayer");
const blackPlayer = document.querySelector("#blackPlayer");

const restartButton = document.querySelector("#restart");


// ==========================
// SOUNDS
// ==========================

const moveSound =
    new Audio("../../sounds/move.mp3");

const hitSound =
    new Audio("../../sounds/hit.mp3");

const checkSound =
    new Audio("../../sounds/check.mp3");

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
let currentPlayer = "white";

let selectedSquare = null;
let selectedPiece = null;
let validMoves = [];

let gameOver = false;
let lastMove = null;

let mateKingColor = null;


// ==========================
// PIECES
// ==========================

const pieces = {
    white: {
        king: "♔",
        queen: "♕",
        rook: "♖",
        bishop: "♗",
        knight: "♘",
        pawn: "♙"
    },

    black: {
        king: "♚",
        queen: "♛",
        rook: "♜",
        bishop: "♝",
        knight: "♞",
        pawn: "♟"
    }
};


function createPiece(type, color) {

    return {
        type: type,
        color: color,
        hasMoved: false
    };
}


// ==========================
// START GAME
// ==========================

function startGame() {

    board = [
        [
            createPiece("rook", "black"),
            createPiece("knight", "black"),
            createPiece("bishop", "black"),
            createPiece("queen", "black"),
            createPiece("king", "black"),
            createPiece("bishop", "black"),
            createPiece("knight", "black"),
            createPiece("rook", "black")
        ],

        [
            createPiece("pawn", "black"),
            createPiece("pawn", "black"),
            createPiece("pawn", "black"),
            createPiece("pawn", "black"),
            createPiece("pawn", "black"),
            createPiece("pawn", "black"),
            createPiece("pawn", "black"),
            createPiece("pawn", "black")
        ],

        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],

        [
            createPiece("pawn", "white"),
            createPiece("pawn", "white"),
            createPiece("pawn", "white"),
            createPiece("pawn", "white"),
            createPiece("pawn", "white"),
            createPiece("pawn", "white"),
            createPiece("pawn", "white"),
            createPiece("pawn", "white")
        ],

        [
            createPiece("rook", "white"),
            createPiece("knight", "white"),
            createPiece("bishop", "white"),
            createPiece("queen", "white"),
            createPiece("king", "white"),
            createPiece("bishop", "white"),
            createPiece("knight", "white"),
            createPiece("rook", "white")
        ]
    ];

    currentPlayer = "white";

    selectedSquare = null;
    selectedPiece = null;

    validMoves = [];

    gameOver = false;
    lastMove = null;
    mateKingColor = null;

    message.textContent = "";

    updateTurn();
    drawBoard();
}


// ==========================
// DRAW BOARD
// ==========================

function drawBoard() {

    chessBoard.innerHTML = "";

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
                lastMove &&
                (
                    (
                        lastMove.fromRow === row &&
                        lastMove.fromCol === col
                    )
                    ||
                    (
                        lastMove.toRow === row &&
                        lastMove.toCol === col
                    )
                )
            ) {

                square.classList.add(
                    "last-move"
                );
            }


            if (
                selectedSquare &&
                selectedSquare.row === row &&
                selectedSquare.col === col
            ) {

                square.classList.add(
                    "selected"
                );
            }


            const move =
                validMoves.find(function(item) {

                    return (
                        item.row === row &&
                        item.col === col
                    );
                });


            if (move) {

                if (board[row][col] === null) {

                    square.classList.add(
                        "valid-move"
                    );

                } else {

                    square.classList.add(
                        "capture-move"
                    );
                }
            }


            const piece =
                board[row][col];


            if (piece !== null) {

                const pieceSpan =
                    document.createElement("span");


                pieceSpan.classList.add(
                    "piece"
                );


                pieceSpan.classList.add(
                    piece.color === "white"
                        ? "white-piece"
                        : "black-piece"
                );


                if (
                    piece.type === "king" &&
                    piece.color === mateKingColor
                ) {

                    pieceSpan.classList.add(
                        "king-defeated"
                    );

                    square.classList.add(
                        "checkmate-square"
                    );
                }


                pieceSpan.textContent =
                    pieces[piece.color][piece.type];


                square.appendChild(
                    pieceSpan
                );
            }


            square.addEventListener(
                "click",
                function() {

                    handleSquareClick(
                        row,
                        col
                    );
                }
            );


            chessBoard.appendChild(
                square
            );
        }
    }
}


// ==========================
// CLICK
// ==========================

function handleSquareClick(row, col) {

    if (gameOver) {
        return;
    }


    const clickedPiece =
        board[row][col];


    if (selectedPiece === null) {

        if (
            clickedPiece !== null &&
            clickedPiece.color === currentPlayer
        ) {

            selectPiece(
                row,
                col
            );
        }

        return;
    }


    if (
        clickedPiece !== null &&
        clickedPiece.color === currentPlayer
    ) {

        selectPiece(
            row,
            col
        );

        return;
    }


    const selectedMove =
        validMoves.find(function(move) {

            return (
                move.row === row &&
                move.col === col
            );
        });


    if (selectedMove) {

        movePiece(
            selectedSquare.row,
            selectedSquare.col,
            row,
            col,
            selectedMove
        );

    } else {

        clearSelection();

        drawBoard();
    }
}


// ==========================
// SELECT
// ==========================

function selectPiece(row, col) {

    selectedSquare = {
        row: row,
        col: col
    };


    selectedPiece =
        board[row][col];


    validMoves =
        getValidMoves(
            row,
            col,
            selectedPiece
        );


    drawBoard();
}


// ==========================
// MOVE
// ==========================

function movePiece(
    fromRow,
    fromCol,
    toRow,
    toCol,
    move
) {

    const movingPiece =
        board[fromRow][fromCol];


    const capturedPiece =
        board[toRow][toCol];


    // ==========================
    // CASTLING
    // ==========================

    if (
        movingPiece.type === "king" &&
        Math.abs(toCol - fromCol) === 2
    ) {

        if (toCol === 6) {

            const rook =
                board[fromRow][7];


            board[fromRow][5] =
                rook;

            board[fromRow][7] =
                null;


            rook.hasMoved =
                true;
        }


        if (toCol === 2) {

            const rook =
                board[fromRow][0];


            board[fromRow][3] =
                rook;

            board[fromRow][0] =
                null;


            rook.hasMoved =
                true;
        }
    }


    board[toRow][toCol] =
        movingPiece;

    board[fromRow][fromCol] =
        null;


    movingPiece.hasMoved =
        true;


    // ==========================
    // MOVE / CAPTURE SOUND
    // ==========================

    if (capturedPiece !== null) {

        playSound(hitSound);

    } else {

        playSound(moveSound);
    }


    lastMove = {
        fromRow,
        fromCol,
        toRow,
        toCol
    };


    // ==========================
    // PROMOTION
    // ==========================

    if (
        movingPiece.type === "pawn" &&
        (
            toRow === 0 ||
            toRow === 7
        )
    ) {

        movingPiece.type =
            "queen";
    }


    clearSelection();


    currentPlayer =
        currentPlayer === "white"
            ? "black"
            : "white";


    checkGameState();

    updateTurn();

    drawBoard();
}


// ==========================
// CHECK / CHECKMATE
// ==========================

function checkGameState() {

    const inCheck =
        isKingInCheck(
            currentPlayer
        );


    const hasMove =
        hasAnyLegalMove(
            currentPlayer
        );


    // ==========================
    // CHECKMATE
    // ==========================

    if (
        inCheck &&
        !hasMove
    ) {

        gameOver = true;


        mateKingColor =
            currentPlayer;


        const winner =
            currentPlayer === "white"
                ? "Black"
                : "White";


        message.textContent =
            "♛ Checkmate! " +
            winner +
            " Wins!";


        turnText.textContent =
            "Checkmate";


        playSound(winSound);


        return;
    }


    // ==========================
    // STALEMATE
    // ==========================

    if (
        !inCheck &&
        !hasMove
    ) {

        gameOver = true;


        message.textContent =
            "🤝 Stalemate!";


        turnText.textContent =
            "Draw";


        return;
    }


    // ==========================
    // CHECK
    // ==========================

    if (inCheck) {

        message.textContent =
            "⚠ Check!";


        playSound(checkSound);

    } else {

        message.textContent =
            "";
    }
}


// ==========================
// ANY LEGAL MOVE
// ==========================

function hasAnyLegalMove(color) {

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece =
                board[row][col];


            if (
                piece &&
                piece.color === color
            ) {

                const moves =
                    getValidMoves(
                        row,
                        col,
                        piece
                    );


                if (
                    moves.length > 0
                ) {

                    return true;
                }
            }
        }
    }


    return false;
}


// ==========================
// IS KING IN CHECK
// ==========================

function isKingInCheck(color) {

    const king =
        findKing(
            board,
            color
        );


    if (!king) {
        return false;
    }


    const enemy =
        color === "white"
            ? "black"
            : "white";


    return isSquareAttackedOnBoard(
        board,
        king.row,
        king.col,
        enemy
    );
}


// ==========================
// FIND KING
// ==========================

function findKing(
    testBoard,
    color
) {

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece =
                testBoard[row][col];


            if (
                piece &&
                piece.color === color &&
                piece.type === "king"
            ) {

                return {
                    row,
                    col
                };
            }
        }
    }


    return null;
}


// ==========================
// LEGAL MOVES
// ==========================

function getValidMoves(
    row,
    col,
    piece
) {

    const pseudoMoves =
        getPseudoMoves(
            row,
            col,
            piece
        );


    return pseudoMoves.filter(
        function(move) {

            return !wouldLeaveKingInCheck(
                row,
                col,
                move.row,
                move.col,
                piece,
                move
            );
        }
    );
}


// ==========================
// SIMULATE MOVE
// ==========================

function wouldLeaveKingInCheck(
    fromRow,
    fromCol,
    toRow,
    toCol,
    piece,
    move
) {

    const testBoard =
        cloneBoard(board);


    const testPiece =
        testBoard[fromRow][fromCol];


    if (
        testPiece.type === "king" &&
        Math.abs(toCol - fromCol) === 2
    ) {

        if (toCol === 6) {

            testBoard[fromRow][5] =
                testBoard[fromRow][7];

            testBoard[fromRow][7] =
                null;
        }


        if (toCol === 2) {

            testBoard[fromRow][3] =
                testBoard[fromRow][0];

            testBoard[fromRow][0] =
                null;
        }
    }


    testBoard[toRow][toCol] =
        testPiece;

    testBoard[fromRow][fromCol] =
        null;


    const king =
        findKing(
            testBoard,
            piece.color
        );


    if (!king) {
        return true;
    }


    const enemy =
        piece.color === "white"
            ? "black"
            : "white";


    return isSquareAttackedOnBoard(
        testBoard,
        king.row,
        king.col,
        enemy
    );
}


// ==========================
// COPY BOARD
// ==========================

function cloneBoard(original) {

    return original.map(
        function(row) {

            return row.map(
                function(piece) {

                    if (!piece) {
                        return null;
                    }


                    return {
                        type:
                            piece.type,

                        color:
                            piece.color,

                        hasMoved:
                            piece.hasMoved
                    };
                }
            );
        }
    );
}


// ==========================
// PSEUDO MOVES
// ==========================

function getPseudoMoves(
    row,
    col,
    piece
) {

    if (piece.type === "pawn") {

        return getPawnMoves(
            row,
            col,
            piece
        );
    }


    if (piece.type === "rook") {

        return getSlidingMoves(
            row,
            col,
            piece,
            [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1]
            ]
        );
    }


    if (piece.type === "bishop") {

        return getSlidingMoves(
            row,
            col,
            piece,
            [
                [1, 1],
                [1, -1],
                [-1, 1],
                [-1, -1]
            ]
        );
    }


    if (piece.type === "queen") {

        return getSlidingMoves(
            row,
            col,
            piece,
            [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
                [1, 1],
                [1, -1],
                [-1, 1],
                [-1, -1]
            ]
        );
    }


    if (piece.type === "knight") {

        return getKnightMoves(
            row,
            col,
            piece
        );
    }


    if (piece.type === "king") {

        return getKingMoves(
            row,
            col,
            piece
        );
    }


    return [];
}


// ==========================
// PAWN
// ==========================

function getPawnMoves(
    row,
    col,
    piece
) {

    const moves = [];


    const direction =
        piece.color === "white"
            ? -1
            : 1;


    const startRow =
        piece.color === "white"
            ? 6
            : 1;


    const nextRow =
        row + direction;


    if (
        isInside(
            nextRow,
            col
        ) &&
        board[nextRow][col] === null
    ) {

        moves.push({
            row: nextRow,
            col: col
        });


        const twoRows =
            row +
            direction * 2;


        if (
            row === startRow &&
            board[twoRows][col] === null
        ) {

            moves.push({
                row: twoRows,
                col: col
            });
        }
    }


    [
        col - 1,
        col + 1
    ].forEach(function(c) {

        if (
            isInside(
                nextRow,
                c
            ) &&
            board[nextRow][c] &&
            board[nextRow][c].color !== piece.color &&
            board[nextRow][c].type !== "king"
        ) {

            moves.push({
                row: nextRow,
                col: c
            });
        }
    });


    return moves;
}


// ==========================
// SLIDING
// ==========================

function getSlidingMoves(
    row,
    col,
    piece,
    directions
) {

    const moves = [];


    directions.forEach(
        function(direction) {

            let newRow =
                row +
                direction[0];

            let newCol =
                col +
                direction[1];


            while (
                isInside(
                    newRow,
                    newCol
                )
            ) {

                const target =
                    board[newRow][newCol];


                if (target === null) {

                    moves.push({
                        row: newRow,
                        col: newCol
                    });

                } else {

                    if (
                        target.color !== piece.color &&
                        target.type !== "king"
                    ) {

                        moves.push({
                            row: newRow,
                            col: newCol
                        });
                    }


                    break;
                }


                newRow +=
                    direction[0];

                newCol +=
                    direction[1];
            }
        }
    );


    return moves;
}


// ==========================
// KNIGHT
// ==========================

function getKnightMoves(
    row,
    col,
    piece
) {

    const moves = [];


    const possibilities = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1]
    ];


    possibilities.forEach(
        function(move) {

            const newRow =
                row +
                move[0];

            const newCol =
                col +
                move[1];


            if (
                canMoveTo(
                    newRow,
                    newCol,
                    piece.color
                )
            ) {

                moves.push({
                    row: newRow,
                    col: newCol
                });
            }
        }
    );


    return moves;
}


// ==========================
// KING
// ==========================

function getKingMoves(
    row,
    col,
    piece
) {

    const moves = [];


    for (
        let r = -1;
        r <= 1;
        r++
    ) {

        for (
            let c = -1;
            c <= 1;
            c++
        ) {

            if (
                r === 0 &&
                c === 0
            ) {
                continue;
            }


            const newRow =
                row + r;

            const newCol =
                col + c;


            if (
                canMoveTo(
                    newRow,
                    newCol,
                    piece.color
                )
            ) {

                moves.push({
                    row: newRow,
                    col: newCol
                });
            }
        }
    }


    // ==========================
    // CASTLING
    // ==========================

    if (
        !piece.hasMoved &&
        col === 4
    ) {

        const enemy =
            piece.color === "white"
                ? "black"
                : "white";


        if (
            !isSquareAttackedOnBoard(
                board,
                row,
                4,
                enemy
            )
        ) {

            const rightRook =
                board[row][7];


            if (
                rightRook &&
                rightRook.type === "rook" &&
                rightRook.color === piece.color &&
                !rightRook.hasMoved &&
                board[row][5] === null &&
                board[row][6] === null &&
                !isSquareAttackedOnBoard(
                    board,
                    row,
                    5,
                    enemy
                ) &&
                !isSquareAttackedOnBoard(
                    board,
                    row,
                    6,
                    enemy
                )
            ) {

                moves.push({
                    row: row,
                    col: 6,
                    castle: "short"
                });
            }


            const leftRook =
                board[row][0];


            if (
                leftRook &&
                leftRook.type === "rook" &&
                leftRook.color === piece.color &&
                !leftRook.hasMoved &&
                board[row][1] === null &&
                board[row][2] === null &&
                board[row][3] === null &&
                !isSquareAttackedOnBoard(
                    board,
                    row,
                    3,
                    enemy
                ) &&
                !isSquareAttackedOnBoard(
                    board,
                    row,
                    2,
                    enemy
                )
            ) {

                moves.push({
                    row: row,
                    col: 2,
                    castle: "long"
                });
            }
        }
    }


    return moves;
}


// ==========================
// ATTACK DETECTION
// ==========================

function isSquareAttackedOnBoard(
    testBoard,
    targetRow,
    targetCol,
    attackerColor
) {

    for (let row = 0; row < 8; row++) {

        for (let col = 0; col < 8; col++) {

            const piece =
                testBoard[row][col];


            if (
                !piece ||
                piece.color !== attackerColor
            ) {
                continue;
            }


            if (
                pieceAttacksSquare(
                    testBoard,
                    row,
                    col,
                    piece,
                    targetRow,
                    targetCol
                )
            ) {

                return true;
            }
        }
    }


    return false;
}


// ==========================
// PIECE ATTACKS
// ==========================

function pieceAttacksSquare(
    testBoard,
    row,
    col,
    piece,
    targetRow,
    targetCol
) {

    const rowDiff =
        targetRow - row;

    const colDiff =
        targetCol - col;


    if (piece.type === "pawn") {

        const direction =
            piece.color === "white"
                ? -1
                : 1;


        return (
            rowDiff === direction &&
            Math.abs(colDiff) === 1
        );
    }


    if (piece.type === "knight") {

        return (
            (
                Math.abs(rowDiff) === 2 &&
                Math.abs(colDiff) === 1
            )
            ||
            (
                Math.abs(rowDiff) === 1 &&
                Math.abs(colDiff) === 2
            )
        );
    }


    if (piece.type === "king") {

        return (
            Math.abs(rowDiff) <= 1 &&
            Math.abs(colDiff) <= 1 &&
            !(
                rowDiff === 0 &&
                colDiff === 0
            )
        );
    }


    if (
        piece.type === "rook" &&
        (
            rowDiff === 0 ||
            colDiff === 0
        )
    ) {

        return pathIsClear(
            testBoard,
            row,
            col,
            targetRow,
            targetCol
        );
    }


    if (
        piece.type === "bishop" &&
        Math.abs(rowDiff) ===
        Math.abs(colDiff)
    ) {

        return pathIsClear(
            testBoard,
            row,
            col,
            targetRow,
            targetCol
        );
    }


    if (
        piece.type === "queen" &&
        (
            rowDiff === 0 ||
            colDiff === 0 ||
            Math.abs(rowDiff) ===
            Math.abs(colDiff)
        )
    ) {

        return pathIsClear(
            testBoard,
            row,
            col,
            targetRow,
            targetCol
        );
    }


    return false;
}


// ==========================
// PATH CLEAR
// ==========================

function pathIsClear(
    testBoard,
    fromRow,
    fromCol,
    toRow,
    toCol
) {

    const rowStep =
        Math.sign(
            toRow - fromRow
        );

    const colStep =
        Math.sign(
            toCol - fromCol
        );


    let row =
        fromRow + rowStep;

    let col =
        fromCol + colStep;


    while (
        row !== toRow ||
        col !== toCol
    ) {

        if (
            testBoard[row][col] !== null
        ) {

            return false;
        }


        row += rowStep;
        col += colStep;
    }


    return true;
}


// ==========================
// HELPERS
// ==========================

function canMoveTo(
    row,
    col,
    color
) {

    if (!isInside(row, col)) {
        return false;
    }


    const target =
        board[row][col];


    if (target === null) {
        return true;
    }


    if (target.type === "king") {
        return false;
    }


    return (
        target.color !== color
    );
}


function isInside(
    row,
    col
) {

    return (
        row >= 0 &&
        row < 8 &&
        col >= 0 &&
        col < 8
    );
}


// ==========================
// TURN
// ==========================

function updateTurn() {

    if (gameOver) {
        return;
    }


    if (
        currentPlayer === "white"
    ) {

        turnText.textContent =
            "White Turn";


        whitePlayer.classList.add(
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

        whitePlayer.classList.remove(
            "active"
        );
    }
}


// ==========================
// CLEAR
// ==========================

function clearSelection() {

    selectedSquare = null;
    selectedPiece = null;
    validMoves = [];
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