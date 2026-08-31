const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.querySelector("#score");
const message = document.querySelector("#message");

const startButton = document.querySelector("#start");
const restartButton = document.querySelector("#restart");

const upBtn = document.querySelector("#upBtn");
const downBtn = document.querySelector("#downBtn");
const leftBtn = document.querySelector("#leftBtn");
const rightBtn = document.querySelector("#rightBtn");


// ==========================
// SOUNDS
// ==========================

const clickSound = new Audio("../../sounds/click.mp3");
const eatSound = new Audio("../../sounds/eat.mp3");
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

const box = 20;

let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];

let direction = "RIGHT";

let food = {
    x: 100,
    y: 100
};

let score = 0;

let gameOver = false;

let gameStarted = false;

let gameInterval = null;


// ==========================
// KEYBOARD
// ==========================

document.addEventListener("keydown", function(event) {

    if (gameStarted === false) {
        return;
    }

    if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    }

    if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    }

    if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    }

    if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    }
});


// ==========================
// MOBILE CONTROLS
// ==========================

upBtn.addEventListener("click", function() {

    if (gameStarted && direction !== "DOWN") {
        direction = "UP";
    }
});

downBtn.addEventListener("click", function() {

    if (gameStarted && direction !== "UP") {
        direction = "DOWN";
    }
});

leftBtn.addEventListener("click", function() {

    if (gameStarted && direction !== "RIGHT") {
        direction = "LEFT";
    }
});

rightBtn.addEventListener("click", function() {

    if (gameStarted && direction !== "LEFT") {
        direction = "RIGHT";
    }
});


// ==========================
// APPLE
// ==========================

function drawApple() {

    const centerX = food.x + box / 2;
    const centerY = food.y + box / 2;

    ctx.beginPath();
    ctx.fillStyle = "#e53935";

    ctx.arc(
        centerX,
        centerY + 2,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();
    ctx.fillStyle = "#ff8a80";

    ctx.arc(
        centerX - 3,
        centerY - 2,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.strokeStyle = "#6d4c41";
    ctx.lineWidth = 2;

    ctx.moveTo(
        centerX,
        food.y + 4
    );

    ctx.lineTo(
        centerX + 2,
        food.y - 1
    );

    ctx.stroke();


    ctx.beginPath();
    ctx.fillStyle = "#43a047";

    ctx.ellipse(
        centerX + 5,
        food.y + 3,
        5,
        3,
        -0.5,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ==========================
// SNAKE
// ==========================

function drawSnake() {

    snake.forEach(function(part, index) {

        const padding = 1;

        const x = part.x + padding;
        const y = part.y + padding;

        const size = box - padding * 2;

        ctx.beginPath();

        ctx.roundRect(
            x,
            y,
            size,
            size,
            6
        );

        if (index === 0) {

            ctx.fillStyle = "#2e7d32";

        } else {

            ctx.fillStyle = "#66bb6a";
        }

        ctx.fill();


        ctx.beginPath();

        ctx.fillStyle =
            index === 0
                ? "#81c784"
                : "#a5d6a7";

        ctx.roundRect(
            x + 3,
            y + 3,
            size - 6,
            4,
            2
        );

        ctx.fill();


        if (index === 0) {

            drawSnakeEyes(part);
            drawSnakeTongue(part);
        }
    });
}


// ==========================
// EYES
// ==========================

function drawSnakeEyes(part) {

    let eye1X;
    let eye1Y;

    let eye2X;
    let eye2Y;

    if (direction === "RIGHT") {

        eye1X = part.x + 14;
        eye1Y = part.y + 6;

        eye2X = part.x + 14;
        eye2Y = part.y + 14;

    } else if (direction === "LEFT") {

        eye1X = part.x + 6;
        eye1Y = part.y + 6;

        eye2X = part.x + 6;
        eye2Y = part.y + 14;

    } else if (direction === "UP") {

        eye1X = part.x + 6;
        eye1Y = part.y + 6;

        eye2X = part.x + 14;
        eye2Y = part.y + 6;

    } else {

        eye1X = part.x + 6;
        eye1Y = part.y + 14;

        eye2X = part.x + 14;
        eye2Y = part.y + 14;
    }


    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(eye1X, eye1Y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eye2X, eye2Y, 3, 0, Math.PI * 2);
    ctx.fill();


    ctx.fillStyle = "#111";

    ctx.beginPath();
    ctx.arc(eye1X, eye1Y, 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(eye2X, eye2Y, 1.4, 0, Math.PI * 2);
    ctx.fill();
}


// ==========================
// TONGUE
// ==========================

function drawSnakeTongue(part) {

    ctx.beginPath();

    ctx.strokeStyle = "#ff1744";
    ctx.lineWidth = 2;

    if (direction === "RIGHT") {

        ctx.moveTo(part.x + 20, part.y + 10);
        ctx.lineTo(part.x + 25, part.y + 10);

    } else if (direction === "LEFT") {

        ctx.moveTo(part.x, part.y + 10);
        ctx.lineTo(part.x - 5, part.y + 10);

    } else if (direction === "UP") {

        ctx.moveTo(part.x + 10, part.y);
        ctx.lineTo(part.x + 10, part.y - 5);

    } else {

        ctx.moveTo(part.x + 10, part.y + 20);
        ctx.lineTo(part.x + 10, part.y + 25);
    }

    ctx.stroke();
}


// ==========================
// DRAW STATIC BOARD
// ==========================

function drawStaticBoard() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawApple();
    drawSnake();
}


// ==========================
// GAME LOOP
// ==========================

function drawGame() {

    if (gameOver === true) {
        return;
    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawApple();
    drawSnake();


    let headX = snake[0].x;
    let headY = snake[0].y;


    if (direction === "UP") {
        headY -= box;
    }

    if (direction === "DOWN") {
        headY += box;
    }

    if (direction === "LEFT") {
        headX -= box;
    }

    if (direction === "RIGHT") {
        headX += box;
    }


    const newHead = {
        x: headX,
        y: headY
    };


    // ==========================
    // APPLE
    // ==========================

    if (
        headX === food.x &&
        headY === food.y
    ) {

        score++;

        scoreText.textContent =
            "Score: " + score;

        playSound(eatSound);

        createFood();

    } else {

        snake.pop();
    }


    // ==========================
    // WALL
    // ==========================

    if (
        headX < 0 ||
        headY < 0 ||
        headX >= canvas.width ||
        headY >= canvas.height
    ) {

        endGame();

        return;
    }


    // ==========================
    // SNAKE BODY
    // ==========================

    for (let part of snake) {

        if (
            headX === part.x &&
            headY === part.y
        ) {

            endGame();

            return;
        }
    }


    snake.unshift(newHead);
}


// ==========================
// FOOD
// ==========================

function createFood() {

    food.x =
        Math.floor(
            Math.random() *
            (canvas.width / box)
        ) * box;


    food.y =
        Math.floor(
            Math.random() *
            (canvas.height / box)
        ) * box;
}


// ==========================
// START GAME
// ==========================

startButton.addEventListener("click", function() {

    if (gameStarted === true) {
        return;
    }

    playSound(clickSound);

    gameStarted = true;

    startButton.style.display = "none";

    gameInterval =
        setInterval(drawGame, 120);
});


// ==========================
// GAME OVER
// ==========================

function endGame() {

    gameOver = true;

    gameStarted = false;

    clearInterval(gameInterval);

    gameInterval = null;

    playSound(loseSound);

    message.textContent =
        "Game Over! Score: " + score;

    startButton.textContent =
        "▶ Play Again";

    startButton.style.display =
        "block";
}


// ==========================
// RESTART
// ==========================

restartButton.addEventListener("click", function() {

    playSound(clickSound);

    clearInterval(gameInterval);

    gameInterval = null;


    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];


    direction = "RIGHT";

    score = 0;

    gameOver = false;

    gameStarted = false;


    scoreText.textContent =
        "Score: 0";

    message.textContent = "";


    createFood();

    drawStaticBoard();


    startButton.textContent =
        "▶ Start Game";

    startButton.style.display =
        "block";
});


// ==========================
// INITIAL STATE
// ==========================

createFood();

drawStaticBoard();