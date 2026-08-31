const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const score1Text = document.querySelector("#score1");
const score2Text = document.querySelector("#score2");

const startButton = document.querySelector("#start");
const restartButton = document.querySelector("#restart");
const resetScoreButton = document.querySelector("#resetScore");

const message = document.querySelector("#message");

const p1Up = document.querySelector("#p1Up");
const p1Down = document.querySelector("#p1Down");

const p2Up = document.querySelector("#p2Up");
const p2Down = document.querySelector("#p2Down");


// ==========================
// SOUNDS
// ==========================

const hitSound =
    new Audio("../../sounds/hit.mp3");

const goalSound =
    new Audio("../../sounds/goal.mp3");

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

let score1 = 0;
let score2 = 0;

let gameStarted = false;
let animationId = null;


const paddleWidth = 14;
const paddleHeight = 90;

let player1Y =
    canvas.height / 2 -
    paddleHeight / 2;

let player2Y =
    canvas.height / 2 -
    paddleHeight / 2;

const paddleSpeed = 6;


let ballX =
    canvas.width / 2;

let ballY =
    canvas.height / 2;

let ballRadius = 10;

let ballSpeedX = 5;
let ballSpeedY = 4;


const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};


// ==========================
// KEYBOARD
// ==========================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "w" ||
            event.key === "W"
        ) {
            keys.w = true;
        }

        if (
            event.key === "s" ||
            event.key === "S"
        ) {
            keys.s = true;
        }

        if (event.key === "ArrowUp") {

            event.preventDefault();

            keys.ArrowUp = true;
        }

        if (event.key === "ArrowDown") {

            event.preventDefault();

            keys.ArrowDown = true;
        }
    }
);


document.addEventListener(
    "keyup",
    function(event) {

        if (
            event.key === "w" ||
            event.key === "W"
        ) {
            keys.w = false;
        }

        if (
            event.key === "s" ||
            event.key === "S"
        ) {
            keys.s = false;
        }

        if (event.key === "ArrowUp") {
            keys.ArrowUp = false;
        }

        if (event.key === "ArrowDown") {
            keys.ArrowDown = false;
        }
    }
);


// ==========================
// DRAW FIELD
// ==========================

function drawField() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle = "#090c18";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.strokeStyle =
        "rgba(255,255,255,0.25)";

    ctx.lineWidth = 3;

    ctx.setLineDash([12, 12]);

    ctx.beginPath();

    ctx.moveTo(
        canvas.width / 2,
        0
    );

    ctx.lineTo(
        canvas.width / 2,
        canvas.height
    );

    ctx.stroke();

    ctx.setLineDash([]);


    ctx.fillStyle = "#6d7cff";

    ctx.fillRect(
        25,
        player1Y,
        paddleWidth,
        paddleHeight
    );


    ctx.fillStyle = "#ff5e7d";

    ctx.fillRect(
        canvas.width -
        25 -
        paddleWidth,
        player2Y,
        paddleWidth,
        paddleHeight
    );


    ctx.beginPath();

    ctx.fillStyle = "white";

    ctx.arc(
        ballX,
        ballY,
        ballRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ==========================
// MOVE PADDLES
// ==========================

function movePaddles() {

    if (keys.w) {
        player1Y -= paddleSpeed;
    }

    if (keys.s) {
        player1Y += paddleSpeed;
    }

    if (keys.ArrowUp) {
        player2Y -= paddleSpeed;
    }

    if (keys.ArrowDown) {
        player2Y += paddleSpeed;
    }


    if (player1Y < 0) {
        player1Y = 0;
    }

    if (
        player1Y + paddleHeight >
        canvas.height
    ) {

        player1Y =
            canvas.height -
            paddleHeight;
    }


    if (player2Y < 0) {
        player2Y = 0;
    }

    if (
        player2Y + paddleHeight >
        canvas.height
    ) {

        player2Y =
            canvas.height -
            paddleHeight;
    }
}


// ==========================
// MOVE BALL
// ==========================

function moveBall() {

    ballX += ballSpeedX;
    ballY += ballSpeedY;


    // top / bottom
    if (
        ballY - ballRadius <= 0 ||
        ballY + ballRadius >= canvas.height
    ) {

        ballSpeedY *= -1;
    }


    // ==========================
    // PLAYER 1 COLLISION
    // ==========================

    if (
        ballX - ballRadius <=
        25 + paddleWidth &&

        ballX > 25 &&

        ballY >= player1Y &&
        ballY <=
        player1Y + paddleHeight &&

        ballSpeedX < 0
    ) {

        ballX =
            25 +
            paddleWidth +
            ballRadius;

        ballSpeedX *= -1;

        changeBallAngle(
            player1Y
        );

        playSound(hitSound);
    }


    // ==========================
    // PLAYER 2 COLLISION
    // ==========================

    const player2X =
        canvas.width -
        25 -
        paddleWidth;


    if (
        ballX + ballRadius >=
        player2X &&

        ballX <
        player2X + paddleWidth &&

        ballY >= player2Y &&
        ballY <=
        player2Y + paddleHeight &&

        ballSpeedX > 0
    ) {

        ballX =
            player2X -
            ballRadius;

        ballSpeedX *= -1;

        changeBallAngle(
            player2Y
        );

        playSound(hitSound);
    }


    // ==========================
    // PLAYER 2 SCORES
    // ==========================

    if (
        ballX <
        -ballRadius
    ) {

        score2++;

        score2Text.textContent =
            score2;

        message.textContent =
            "Player 2 scores!";

        playSound(goalSound);

        resetBall(-1);
    }


    // ==========================
    // PLAYER 1 SCORES
    // ==========================

    if (
        ballX >
        canvas.width +
        ballRadius
    ) {

        score1++;

        score1Text.textContent =
            score1;

        message.textContent =
            "Player 1 scores!";

        playSound(goalSound);

        resetBall(1);
    }
}


// ==========================
// BALL ANGLE
// ==========================

function changeBallAngle(paddleY) {

    const paddleCenter =
        paddleY +
        paddleHeight / 2;

    const distance =
        ballY -
        paddleCenter;

    const normalized =
        distance /
        (paddleHeight / 2);


    ballSpeedY =
        normalized * 6;


    if (
        Math.abs(ballSpeedX) < 9
    ) {

        ballSpeedX *= 1.04;
    }
}


// ==========================
// RESET BALL
// ==========================

function resetBall(direction) {

    ballX =
        canvas.width / 2;

    ballY =
        canvas.height / 2;


    ballSpeedX =
        5 * direction;


    ballSpeedY =
        Math.random() > 0.5
            ? 4
            : -4;
}


// ==========================
// GAME LOOP
// ==========================

function gameLoop() {

    if (
        gameStarted === false
    ) {
        return;
    }


    movePaddles();

    moveBall();

    drawField();


    animationId =
        requestAnimationFrame(
            gameLoop
        );
}


// ==========================
// START
// ==========================

startButton.addEventListener(
    "click",
    function() {

        if (
            gameStarted === true
        ) {
            return;
        }


        playSound(clickSound);


        gameStarted = true;

        startButton.style.display =
            "none";

        message.textContent = "";


        gameLoop();
    }
);


// ==========================
// RESTART GAME
// ==========================

restartButton.addEventListener(
    "click",
    function() {

        playSound(clickSound);


        gameStarted = false;

        cancelAnimationFrame(
            animationId
        );


        player1Y =
            canvas.height / 2 -
            paddleHeight / 2;

        player2Y =
            canvas.height / 2 -
            paddleHeight / 2;


        resetBall(
            Math.random() > 0.5
                ? 1
                : -1
        );


        message.textContent = "";


        startButton.textContent =
            "▶ Start Game";

        startButton.style.display =
            "block";


        drawField();
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

        score1Text.textContent =
            "0";

        score2Text.textContent =
            "0";


        gameStarted = false;

        cancelAnimationFrame(
            animationId
        );


        player1Y =
            canvas.height / 2 -
            paddleHeight / 2;

        player2Y =
            canvas.height / 2 -
            paddleHeight / 2;


        resetBall(1);


        message.textContent = "";


        startButton.textContent =
            "▶ Start Game";

        startButton.style.display =
            "block";


        drawField();
    }
);


// ==========================
// MOBILE TOUCH CONTROLS
// ==========================

function holdButton(
    button,
    keyName
) {

    button.addEventListener(
        "pointerdown",
        function(event) {

            event.preventDefault();

            keys[keyName] = true;
        }
    );


    button.addEventListener(
        "pointerup",
        function() {

            keys[keyName] = false;
        }
    );


    button.addEventListener(
        "pointercancel",
        function() {

            keys[keyName] = false;
        }
    );


    button.addEventListener(
        "pointerleave",
        function() {

            keys[keyName] = false;
        }
    );
}


holdButton(
    p1Up,
    "w"
);

holdButton(
    p1Down,
    "s"
);

holdButton(
    p2Up,
    "ArrowUp"
);

holdButton(
    p2Down,
    "ArrowDown"
);


// ==========================
// INITIAL SCREEN
// ==========================

drawField();