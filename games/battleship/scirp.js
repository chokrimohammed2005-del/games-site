const gameBoard = document.querySelector("#gameBoard");

const turnText = document.querySelector("#turnText");
const instructionText = document.querySelector("#instructionText");
const message = document.querySelector("#message");

const player1Box = document.querySelector("#player1Box");
const player2Box = document.querySelector("#player2Box");

const player1Status = document.querySelector("#player1Status");
const player2Status = document.querySelector("#player2Status");

const shipPanel = document.querySelector("#shipPanel");
const shipButtons = document.querySelectorAll(".ship-btn");

const rotateBtn = document.querySelector("#rotateBtn");
const readyBtn = document.querySelector("#readyBtn");
const restartBtn = document.querySelector("#restart");

const boardSize = 10;

let phase = "setup1";

let currentPlayer = 1;
let orientation = "horizontal";

let selectedShipSize = 4;

let player1Board = [];
let player2Board = [];

let player1Shots = [];
let player2Shots = [];

let shipsToPlace = [4, 3, 2];

let gameOver = false;


// ==========================
// CREATE EMPTY BOARD
// ==========================

function createEmptyBoard() {

    const newBoard = [];

    for (let row = 0; row < boardSize; row++) {

        newBoard[row] = [];

        for (let col = 0; col < boardSize; col++) {

            newBoard[row][col] = 0;
        }
    }

    return newBoard;
}


// ==========================
// CREATE SHOT BOARD
// ==========================

function createShotBoard() {

    const newBoard = [];

    for (let row = 0; row < boardSize; row++) {

        newBoard[row] = [];

        for (let col = 0; col < boardSize; col++) {

            newBoard[row][col] = 0;
        }
    }

    return newBoard;
}


// ==========================
// START
// ==========================

function startGame() {

    player1Board = createEmptyBoard();
    player2Board = createEmptyBoard();

    player1Shots = createShotBoard();
    player2Shots = createShotBoard();

    phase = "setup1";

    currentPlayer = 1;

    orientation = "horizontal";

    selectedShipSize = 4;

    shipsToPlace = [4, 3, 2];

    gameOver = false;

    message.textContent = "";

    rotateBtn.textContent = "Rotate: Horizontal";

    updateShipButtons();
    updateUI();
    drawBoard();
}


// ==========================
// CURRENT BOARD
// ==========================

function getCurrentBoard() {

    if (phase === "setup1") {
        return player1Board;
    }

    if (phase === "setup2") {
        return player2Board;
    }

    return currentPlayer === 1
        ? player2Board
        : player1Board;
}


// ==========================
// CURRENT SHOTS
// ==========================

function getCurrentShots() {

    return currentPlayer === 1
        ? player1Shots
        : player2Shots;
}


// ==========================
// DRAW BOARD
// ==========================

function drawBoard() {

    gameBoard.innerHTML = "";

    const board = getCurrentBoard();

    const isSetup =
        phase === "setup1" ||
        phase === "setup2";


    for (let row = 0; row < boardSize; row++) {

        for (let col = 0; col < boardSize; col++) {

            const cell =
                document.createElement("button");

            cell.classList.add("cell");

            cell.dataset.row = row;
            cell.dataset.col = col;


            if (isSetup) {

                if (board[row][col] === 1) {
                    cell.classList.add("ship");
                }

                cell.addEventListener(
                    "mouseenter",
                    function() {

                        showPreview(
                            row,
                            col
                        );
                    }
                );

                cell.addEventListener(
                    "mouseleave",
                    function() {

                        clearPreview();
                    }
                );

                cell.addEventListener(
                    "click",
                    function() {

                        placeShip(
                            row,
                            col
                        );
                    }
                );

            } else {

                const shots =
                    getCurrentShots();

                if (shots[row][col] === 1) {
                    cell.classList.add("miss");
                }

                if (shots[row][col] === 2) {
                    cell.classList.add("hit");
                }

                if (shots[row][col] === 3) {
                    cell.classList.add("hit");
                    cell.classList.add("sunk");
                }

                cell.addEventListener(
                    "click",
                    function() {

                        attackCell(
                            row,
                            col
                        );
                    }
                );
            }


            gameBoard.appendChild(cell);
        }
    }
}


// ==========================
// SHIP PREVIEW
// ==========================

function showPreview(row, col) {

    if (
        phase !== "setup1" &&
        phase !== "setup2"
    ) {
        return;
    }

    clearPreview();

    const cells =
        getShipCells(
            row,
            col,
            selectedShipSize
        );

    const valid =
        canPlaceShip(
            getCurrentBoard(),
            cells
        );

    cells.forEach(function(position) {

        const cell =
            getCellElement(
                position.row,
                position.col
            );

        if (!cell) {
            return;
        }

        cell.classList.add(
            valid
                ? "preview"
                : "invalid-preview"
        );
    });
}


// ==========================
// CLEAR PREVIEW
// ==========================

function clearPreview() {

    document
        .querySelectorAll(
            ".preview, .invalid-preview"
        )
        .forEach(function(cell) {

            cell.classList.remove(
                "preview",
                "invalid-preview"
            );
        });
}


// ==========================
// GET SHIP CELLS
// ==========================

function getShipCells(
    row,
    col,
    size
) {

    const cells = [];

    for (let i = 0; i < size; i++) {

        if (
            orientation === "horizontal"
        ) {

            cells.push({
                row: row,
                col: col + i
            });

        } else {

            cells.push({
                row: row + i,
                col: col
            });
        }
    }

    return cells;
}


// ==========================
// CAN PLACE
// ==========================

function canPlaceShip(
    board,
    cells
) {

    for (const position of cells) {

        if (
            position.row < 0 ||
            position.row >= boardSize ||
            position.col < 0 ||
            position.col >= boardSize
        ) {

            return false;
        }

        if (
            board[position.row][position.col]
            !== 0
        ) {

            return false;
        }
    }

    return true;
}


// ==========================
// PLACE SHIP
// ==========================

function placeShip(row, col) {

    if (
        !shipsToPlace.includes(
            selectedShipSize
        )
    ) {
        return;
    }


    const board =
        getCurrentBoard();


    const cells =
        getShipCells(
            row,
            col,
            selectedShipSize
        );


    if (
        !canPlaceShip(
            board,
            cells
        )
    ) {

        message.textContent =
            "That ship does not fit there.";

        return;
    }


    cells.forEach(function(position) {

        board[position.row][position.col] =
            1;
    });


    shipsToPlace =
        shipsToPlace.filter(
            function(size) {

                return size !==
                    selectedShipSize;
            }
        );


    message.textContent = "";


    if (shipsToPlace.length > 0) {

        selectedShipSize =
            shipsToPlace[0];

    } else {

        readyBtn.disabled = false;
    }


    updateShipButtons();
    drawBoard();
}


// ==========================
// SHIP BUTTONS
// ==========================

shipButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            const size =
                Number(
                    button.dataset.size
                );


            if (
                !shipsToPlace.includes(size)
            ) {
                return;
            }


            selectedShipSize = size;

            updateShipButtons();
        }
    );
});


function updateShipButtons() {

    shipButtons.forEach(function(button) {

        const size =
            Number(
                button.dataset.size
            );


        button.classList.remove("active");


        if (
            shipsToPlace.includes(size)
        ) {

            button.disabled = false;

        } else {

            button.disabled = true;
        }


        if (
            size === selectedShipSize &&
            shipsToPlace.includes(size)
        ) {

            button.classList.add("active");
        }
    });
}


// ==========================
// ROTATE
// ==========================

rotateBtn.addEventListener(
    "click",
    function() {

        orientation =
            orientation === "horizontal"
                ? "vertical"
                : "horizontal";


        rotateBtn.textContent =
            orientation === "horizontal"
                ? "Rotate: Horizontal"
                : "Rotate: Vertical";
    }
);


// ==========================
// READY
// ==========================

readyBtn.addEventListener(
    "click",
    function() {

        if (
            shipsToPlace.length !== 0
        ) {
            return;
        }


        if (phase === "setup1") {

            phase = "setup2";

            currentPlayer = 2;

            shipsToPlace = [4, 3, 2];

            selectedShipSize = 4;

            orientation = "horizontal";

            readyBtn.disabled = true;

            message.textContent =
                "Player 2, place your ships.";

            updateShipButtons();
            updateUI();
            drawBoard();

            return;
        }


        if (phase === "setup2") {

            phase = "battle";

            currentPlayer = 1;

            readyBtn.style.display =
                "none";

            shipPanel.style.display =
                "none";

            message.textContent =
                "Battle started! Player 1 attacks first.";

            updateUI();
            drawBoard();
        }
    }
);


// ==========================
// ATTACK
// ==========================

function attackCell(row, col) {

    if (
        phase !== "battle" ||
        gameOver
    ) {
        return;
    }


    const enemyBoard =
        currentPlayer === 1
            ? player2Board
            : player1Board;


    const shots =
        getCurrentShots();


    if (
        shots[row][col] !== 0
    ) {
        return;
    }


    if (
        enemyBoard[row][col] === 1
    ) {

        shots[row][col] = 2;

        message.textContent =
            "💥 HIT!";

    } else {

        shots[row][col] = 1;

        message.textContent =
            "🌊 Miss!";
    }


    if (
        allShipsDestroyed(
            enemyBoard,
            shots
        )
    ) {

        gameOver = true;

        markDestroyedShips(
            enemyBoard,
            shots
        );

        turnText.textContent =
            "Game Over";

        message.textContent =
            "🏆 Player " +
            currentPlayer +
            " Wins!";

        if (currentPlayer === 1) {

            player1Status.textContent =
                "Winner";

            player2Status.textContent =
                "Defeated";

        } else {

            player2Status.textContent =
                "Winner";

            player1Status.textContent =
                "Defeated";
        }

        drawBoard();

        return;
    }


    setTimeout(
        function() {

            currentPlayer =
                currentPlayer === 1
                    ? 2
                    : 1;

            updateUI();
            drawBoard();

        },
        450
    );
}


// ==========================
// ALL SHIPS DESTROYED
// ==========================

function allShipsDestroyed(
    board,
    shots
) {

    for (let row = 0; row < boardSize; row++) {

        for (let col = 0; col < boardSize; col++) {

            if (
                board[row][col] === 1 &&
                shots[row][col] !== 2 &&
                shots[row][col] !== 3
            ) {

                return false;
            }
        }
    }

    return true;
}


// ==========================
// MARK SUNK
// ==========================

function markDestroyedShips(
    board,
    shots
) {

    for (let row = 0; row < boardSize; row++) {

        for (let col = 0; col < boardSize; col++) {

            if (
                board[row][col] === 1 &&
                shots[row][col] === 2
            ) {

                shots[row][col] = 3;
            }
        }
    }
}


// ==========================
// UI
// ==========================

function updateUI() {

    player1Box.classList.remove("active");
    player2Box.classList.remove("active");


    if (phase === "setup1") {

        turnText.textContent =
            "Player 1 Setup";

        instructionText.textContent =
            "Player 1: place your ships on the board.";

        player1Status.textContent =
            "Place Ships";

        player2Status.textContent =
            "Waiting";

        player1Box.classList.add("active");

        shipPanel.style.display =
            "flex";

        readyBtn.style.display =
            "inline-block";

        return;
    }


    if (phase === "setup2") {

        turnText.textContent =
            "Player 2 Setup";

        instructionText.textContent =
            "Player 2: place your ships. Player 1, do not look!";

        player1Status.textContent =
            "Ready";

        player2Status.textContent =
            "Place Ships";

        player2Box.classList.add("active");

        return;
    }


    if (phase === "battle") {

        turnText.textContent =
            "Player " +
            currentPlayer +
            " Turn";

        instructionText.textContent =
            "Player " +
            currentPlayer +
            ": attack your opponent's fleet.";

        player1Status.textContent =
            currentPlayer === 1
                ? "Attacking"
                : "Waiting";

        player2Status.textContent =
            currentPlayer === 2
                ? "Attacking"
                : "Waiting";


        if (currentPlayer === 1) {

            player1Box.classList.add("active");

        } else {

            player2Box.classList.add("active");
        }
    }
}


// ==========================
// CELL ELEMENT
// ==========================

function getCellElement(
    row,
    col
) {

    return document.querySelector(
        '.cell[data-row="' +
        row +
        '"][data-col="' +
        col +
        '"]'
    );
}


// ==========================
// RESTART
// ==========================

restartBtn.addEventListener(
    "click",
    function() {

        readyBtn.style.display =
            "inline-block";

        shipPanel.style.display =
            "flex";

        startGame();
    }
);


// ==========================
// START GAME
// ==========================

startGame();