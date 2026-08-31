const cells = document.querySelectorAll(".cell");

const message = document.querySelector("#message");
const turn = document.querySelector("#turn");
const gameModeText = document.querySelector("#gameModeText");

const restartButton = document.querySelector("#restart");
const resetScoreButton = document.querySelector("#resetScore");
const changeModeButton = document.querySelector("#changeMode");

const friendModeButton = document.querySelector("#friendMode");
const aiModeButton = document.querySelector("#aiMode");

const modeSelection = document.querySelector("#modeSelection");
const gameArea = document.querySelector("#gameArea");

const scoreXText = document.querySelector("#scoreX");
const scoreOText = document.querySelector("#scoreO");

const xBox = document.querySelector("#xBox");
const oBox = document.querySelector("#oBox");


// ==========================
// SOUNDS
// ==========================

const clickSound =
    new Audio("../../sounds/click.mp3");
    console.log(clickSound.src);

const winSound =
    new Audio("../../sounds/win.mp3");

const drawSound =
    new Audio("../../sounds/draw.mp3");


// ==========================
// GAME VARIABLES
// ==========================

let currentPlayer = "X";
let gameOver = false;
let gameMode = "";

let scoreX = 0;
let scoreO = 0;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];


// ==========================
// PLAY SOUND
// ==========================

function playSound(sound) {

    sound.currentTime = 0;

    sound.play().catch(function() {
        // browser y9dar يمنع sound ila mazal ma kan ta interaction
    });
}


// ==========================
// MODE: SAHBEK
// ==========================

friendModeButton.addEventListener("click", function() {

    gameMode = "friend";

    modeSelection.style.display = "none";
    gameArea.style.display = "block";

    gameModeText.textContent = "👥 Mode: nta vs sahbek";

    startNewGame();
});


// ==========================
// MODE: AI
// ==========================

aiModeButton.addEventListener("click", function() {

    gameMode = "ai";

    modeSelection.style.display = "none";
    gameArea.style.display = "block";

    gameModeText.textContent = "🤖 Mode: nta vs AI";

    startNewGame();
});


// ==========================
// CLICK CELL
// ==========================

cells.forEach(function(cell) {

    cell.addEventListener("click", function() {

        if (
            cell.textContent !== "" ||
            gameOver === true
        ) {
            return;
        }

        if (
            gameMode === "ai" &&
            currentPlayer === "O"
        ) {
            return;
        }

        playMove(cell, currentPlayer);

        if (gameOver === true) {
            return;
        }

        if (gameMode === "friend") {

            switchPlayer();

        } else if (gameMode === "ai") {

            currentPlayer = "O";
            updateTurn();

            setTimeout(function() {

                aiMove();

            }, 450);
        }

    });

});


// ==========================
// PLAY MOVE
// ==========================

function playMove(cell, player) {

    cell.textContent = player;
    cell.classList.add("played");

    if (player === "X") {

        cell.style.color = "blue";

    } else {

        cell.style.color = "red";
    }


    // SOUND DYAL MOVE
    playSound(clickSound);


    checkWinner();
}


// ==========================
// SWITCH PLAYER
// ==========================

function switchPlayer() {

    if (currentPlayer === "X") {

        currentPlayer = "O";

    } else {

        currentPlayer = "X";
    }

    updateTurn();
}


// ==========================
// UPDATE TURN
// ==========================

function updateTurn() {

    turn.textContent =
        "Daba dor " + currentPlayer;

    if (currentPlayer === "X") {

        xBox.classList.add("active");
        oBox.classList.remove("active");

    } else {

        oBox.classList.add("active");
        xBox.classList.remove("active");
    }
}


// ==========================
// CHECK WINNER
// ==========================

function checkWinner() {

    for (
        let combination
        of winningCombinations
    ) {

        const [a, b, c] =
            combination;


        if (
            cells[a].textContent !== "" &&
            cells[a].textContent ===
            cells[b].textContent &&
            cells[a].textContent ===
            cells[c].textContent
        ) {

            cells[a].classList.add("winner");
            cells[b].classList.add("winner");
            cells[c].classList.add("winner");


            message.textContent =
                "🎉 Bravo! Player " +
                cells[a].textContent +
                " rba7!";


            message.classList.remove("draw");
            message.classList.add("win");

            turn.textContent =
                "Game salat";


            if (
                cells[a].textContent === "X"
            ) {

                scoreX++;

            } else {

                scoreO++;
            }


            scoreXText.textContent =
                scoreX;

            scoreOText.textContent =
                scoreO;


            gameOver = true;


            // SOUND DYAL WIN
            playSound(winSound);


            return true;
        }
    }


    let allFilled = true;


    cells.forEach(function(cell) {

        if (
            cell.textContent === ""
        ) {

            allFilled = false;
        }

    });


    if (allFilled === true) {

        message.textContent =
            "🤝 Ta3adol! Ma rba7 7ta wa7ed.";


        message.classList.remove("win");
        message.classList.add("draw");

        turn.textContent =
            "Game salat";

        gameOver = true;


        // SOUND DYAL DRAW
        playSound(drawSound);


        return true;
    }


    return false;
}


// ==========================
// AI SMART
// ==========================

function aiMove() {

    if (gameOver === true) {
        return;
    }


    let board = [];


    cells.forEach(function(cell) {

        board.push(
            cell.textContent
        );
    });


    let emptyIndexes = [];


    board.forEach(
        function(value, index) {

            if (value === "") {

                emptyIndexes.push(
                    index
                );
            }

        }
    );


    if (
        emptyIndexes.length === 0
    ) {
        return;
    }


    let selectedIndex;


    // 90% smart
    // 10% random

    if (
        Math.random() < 0.90
    ) {

        let bestScore =
            -Infinity;


        for (
            let index
            of emptyIndexes
        ) {

            board[index] = "O";


            let score =
                minimax(
                    board,
                    0,
                    false
                );


            board[index] = "";


            if (
                score > bestScore
            ) {

                bestScore =
                    score;

                selectedIndex =
                    index;
            }
        }

    } else {

        selectedIndex =
            emptyIndexes[
                Math.floor(
                    Math.random() *
                    emptyIndexes.length
                )
            ];
    }


    playMove(
        cells[selectedIndex],
        "O"
    );


    if (
        gameOver === false
    ) {

        currentPlayer = "X";

        updateTurn();
    }
}


// ==========================
// MINIMAX
// ==========================

function minimax(
    board,
    depth,
    isMaximizing
) {

    let result =
        checkBoardWinner(board);


    if (result === "O") {

        return 10 - depth;
    }


    if (result === "X") {

        return depth - 10;
    }


    if (result === "draw") {

        return 0;
    }


    if (isMaximizing) {

        let bestScore =
            -Infinity;


        for (
            let i = 0;
            i < board.length;
            i++
        ) {

            if (
                board[i] === ""
            ) {

                board[i] = "O";


                let score =
                    minimax(
                        board,
                        depth + 1,
                        false
                    );


                board[i] = "";


                bestScore =
                    Math.max(
                        score,
                        bestScore
                    );
            }
        }


        return bestScore;

    } else {

        let bestScore =
            Infinity;


        for (
            let i = 0;
            i < board.length;
            i++
        ) {

            if (
                board[i] === ""
            ) {

                board[i] = "X";


                let score =
                    minimax(
                        board,
                        depth + 1,
                        true
                    );


                board[i] = "";


                bestScore =
                    Math.min(
                        score,
                        bestScore
                    );
            }
        }


        return bestScore;
    }
}


// ==========================
// CHECK BOARD FOR AI
// ==========================

function checkBoardWinner(board) {

    for (
        let combination
        of winningCombinations
    ) {

        const [a, b, c] =
            combination;


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return board[a];
        }
    }


    let boardFull = true;


    board.forEach(function(value) {

        if (value === "") {

            boardFull = false;
        }

    });


    if (boardFull === true) {

        return "draw";
    }


    return null;
}


// ==========================
// NEW GAME
// ==========================

function startNewGame() {

    cells.forEach(function(cell) {

        cell.textContent = "";
        cell.style.color = "";

        cell.classList.remove("winner");
        cell.classList.remove("played");
    });


    currentPlayer = "X";
    gameOver = false;


    message.textContent = "";

    message.classList.remove("win");
    message.classList.remove("draw");


    updateTurn();
}


// ==========================
// RESTART
// ==========================

restartButton.addEventListener(
    "click",
    function() {

        startNewGame();
    }
);


// ==========================
// RESET SCORE
// ==========================

resetScoreButton.addEventListener(
    "click",
    function() {

        scoreX = 0;
        scoreO = 0;

        scoreXText.textContent = 0;
        scoreOText.textContent = 0;
    }
);


// ==========================
// CHANGE MODE
// ==========================

changeModeButton.addEventListener(
    "click",
    function() {

        startNewGame();

        scoreX = 0;
        scoreO = 0;

        scoreXText.textContent = 0;
        scoreOText.textContent = 0;

        gameArea.style.display =
            "none";

        modeSelection.style.display =
            "block";
    }
);


// ==========================
// SERVICE WORKER
// ==========================

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        function() {

            navigator.serviceWorker.register(
                "service-worker.js"
            );

        }
    );
}