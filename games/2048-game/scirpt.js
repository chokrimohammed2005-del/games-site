alert("JS khdam");
const gameBoard = document.querySelector("#gameBoard");
const scoreText = document.querySelector("#score");
const message = document.querySelector("#message");
const restartButton = document.querySelector("#restart");

let board = [];
let score = 0;

function startGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    score = 0;
    scoreText.textContent = "Score: 0";
    message.textContent = "";

    addRandomTile();
    addRandomTile();

    drawBoard();
}

function drawBoard() {
    gameBoard.innerHTML = "";

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const tile = document.createElement("div");
            const value = board[row][col];

            tile.classList.add("tile");

            if (value !== 0) {
                tile.textContent = value;
                tile.classList.add("tile-" + value);
            }

            gameBoard.appendChild(tile);
        }
    }
}

function addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }

    if (emptyCells.length === 0) {
        return;
    }

    const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[randomCell.row][randomCell.col] =
        Math.random() < 0.9 ? 2 : 4;
}

function mergeLine(line) {
    let numbers = line.filter(number => number !== 0);

    for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] === numbers[i + 1]) {
            numbers[i] *= 2;

            score += numbers[i];

            numbers[i + 1] = 0;

            i++;
        }
    }

    numbers = numbers.filter(number => number !== 0);

    while (numbers.length < 4) {
        numbers.push(0);
    }

    return numbers;
}

function finishMove(oldBoard) {
    if (JSON.stringify(board) !== oldBoard) {
        addRandomTile();

        scoreText.textContent = "Score: " + score;

        drawBoard();

        checkGameOver();
    }
}

function moveLeft() {
    const oldBoard = JSON.stringify(board);

    for (let row = 0; row < 4; row++) {
        board[row] = mergeLine(board[row]);
    }

    finishMove(oldBoard);
}

function moveRight() {
    const oldBoard = JSON.stringify(board);

    for (let row = 0; row < 4; row++) {
        let line = [...board[row]].reverse();

        line = mergeLine(line);

        board[row] = line.reverse();
    }

    finishMove(oldBoard);
}

function moveUp() {
    const oldBoard = JSON.stringify(board);

    for (let col = 0; col < 4; col++) {
        let line = [];

        for (let row = 0; row < 4; row++) {
            line.push(board[row][col]);
        }

        line = mergeLine(line);

        for (let row = 0; row < 4; row++) {
            board[row][col] = line[row];
        }
    }

    finishMove(oldBoard);
}

function moveDown() {
    const oldBoard = JSON.stringify(board);

    for (let col = 0; col < 4; col++) {
        let line = [];

        for (let row = 0; row < 4; row++) {
            line.push(board[row][col]);
        }

        line.reverse();

        line = mergeLine(line);

        line.reverse();

        for (let row = 0; row < 4; row++) {
            board[row][col] = line[row];
        }
    }

    finishMove(oldBoard);
}

function checkGameOver() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                return;
            }

            if (
                col < 3 &&
                board[row][col] === board[row][col + 1]
            ) {
                return;
            }

            if (
                row < 3 &&
                board[row][col] === board[row + 1][col]
            ) {
                return;
            }
        }
    }

    message.textContent = "Game Over!";
}

document.addEventListener("keydown", function(event) {
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
});

restartButton.addEventListener("click", function() {
    startGame();
});

startGame();