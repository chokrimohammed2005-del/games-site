const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const score1Text = document.querySelector("#score1");
const score2Text = document.querySelector("#score2");

const startButton = document.querySelector("#start");
const restartButton = document.querySelector("#restart");
const resetScoreButton = document.querySelector("#resetScore");

const message = document.querySelector("#message");


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

const paddleRadius = 30;
const puckRadius = 14;

let player1 = {
    x: 120,
    y: canvas.height / 2
};

let player2 = {
    x: canvas.width - 120,
    y: canvas.height / 2
};

let puck = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5,
    vy: 3
};


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

    ctx.fillStyle = "#081325";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.strokeStyle =
        "rgba(255,255,255,0.25)";

    ctx.lineWidth = 3;

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


    ctx.beginPath();

    ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        60,
        0,
        Math.PI * 2
    );

    ctx.stroke();


    const goalHeight = 140;

    ctx.fillStyle =
        "rgba(255,255,255,0.12)";

    ctx.fillRect(
        0,
        canvas.height / 2 -
        goalHeight / 2,
        18,
        goalHeight
    );

    ctx.fillRect(
        canvas.width - 18,
        canvas.height / 2 -
        goalHeight / 2,
        18,
        goalHeight
    );


    drawPaddle(
        player1.x,
        player1.y,
        "#5e7cff"
    );

    drawPaddle(
        player2.x,
        player2.y,
        "#ff5e7d"
    );

    drawPuck();
}


// ==========================
// DRAW PADDLE
// ==========================

function drawPaddle(x, y, color) {

    ctx.beginPath();

    ctx.fillStyle = color;

    ctx.arc(
        x,
        y,
        paddleRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.fillStyle =
        "rgba(255,255,255,0.28)";

    ctx.arc(
        x - 8,
        y - 8,
        10,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ==========================
// DRAW PUCK
// ==========================

function drawPuck() {

    ctx.beginPath();

    ctx.fillStyle = "white";

    ctx.arc(
        puck.x,
        puck.y,
        puckRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ==========================
// MOVE PUCK
// ==========================

function movePuck() {

    puck.x += puck.vx;
    puck.y += puck.vy;


    if (puck.y - puckRadius <= 0) {

        puck.y = puckRadius;

        puck.vy =
            Math.abs(puck.vy);
    }


    if (
        puck.y + puckRadius >=
        canvas.height
    ) {

        puck.y =
            canvas.height - puckRadius;

        puck.vy =
            -Math.abs(puck.vy);
    }


    collideWithPaddle(player1);
    collideWithPaddle(player2);

    checkGoal();
}


// ==========================
// COLLISION
// ==========================

function collideWithPaddle(player) {

    const dx =
        puck.x - player.x;

    const dy =
        puck.y - player.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const minDistance =
        puckRadius + paddleRadius;


    if (
        distance > 0 &&
        distance < minDistance
    ) {

        const angle =
            Math.atan2(dy, dx);


        const speed =
            Math.min(
                10,
                Math.sqrt(
                    puck.vx * puck.vx +
                    puck.vy * puck.vy
                ) + 0.3
            );


        puck.vx =
            Math.cos(angle) * speed;

        puck.vy =
            Math.sin(angle) * speed;


        puck.x =
            player.x +
            Math.cos(angle) *
            minDistance;

        puck.y =
            player.y +
            Math.sin(angle) *
            minDistance;


        // SOUND DYAL HIT
        playSound(hitSound);
    }
}


// ==========================
// GOALS
// ==========================

function checkGoal() {

    const goalTop =
        canvas.height / 2 - 70;

    const goalBottom =
        canvas.height / 2 + 70;


    const insideGoal =
        puck.y >= goalTop &&
        puck.y <= goalBottom;


    // LEFT GOAL
    if (
        puck.x - puckRadius <= 0 &&
        insideGoal
    ) {

        score2++;

        score2Text.textContent =
            score2;

        message.textContent =
            "🥅 Player 2 scores!";


        playSound(goalSound);


        resetPuck(1);

        return;
    }


    // RIGHT GOAL
    if (
        puck.x + puckRadius >=
        canvas.width &&
        insideGoal
    ) {

        score1++;

        score1Text.textContent =
            score1;

        message.textContent =
            "🥅 Player 1 scores!";


        playSound(goalSound);


        resetPuck(-1);

        return;
    }


    if (
        puck.x - puckRadius <= 0
    ) {

        puck.x = puckRadius;

        puck.vx =
            Math.abs(puck.vx);
    }


    if (
        puck.x + puckRadius >=
        canvas.width
    ) {

        puck.x =
            canvas.width - puckRadius;

        puck.vx =
            -Math.abs(puck.vx);
    }
}


// ==========================
// RESET PUCK
// ==========================

function resetPuck(direction) {

    puck.x =
        canvas.width / 2;

    puck.y =
        canvas.height / 2;


    puck.vx =
        5 * direction;


    puck.vy =
        Math.random() > 0.5
            ? 3
            : -3;
}


// ==========================
// LIMIT PADDLES
// ==========================

function limitPaddle(player, side) {

    if (player.y < paddleRadius) {

        player.y =
            paddleRadius;
    }


    if (
        player.y >
        canvas.height -
        paddleRadius
    ) {

        player.y =
            canvas.height -
            paddleRadius;
    }


    if (side === 1) {

        if (player.x < paddleRadius) {

            player.x =
                paddleRadius;
        }


        if (
            player.x >
            canvas.width / 2 -
            paddleRadius
        ) {

            player.x =
                canvas.width / 2 -
                paddleRadius;
        }

    } else {

        if (
            player.x <
            canvas.width / 2 +
            paddleRadius
        ) {

            player.x =
                canvas.width / 2 +
                paddleRadius;
        }


        if (
            player.x >
            canvas.width -
            paddleRadius
        ) {

            player.x =
                canvas.width -
                paddleRadius;
        }
    }
}


// ==========================
// POINTER POSITION
// ==========================

function getCanvasPosition(event) {

    const rect =
        canvas.getBoundingClientRect();


    const scaleX =
        canvas.width / rect.width;

    const scaleY =
        canvas.height / rect.height;


    return {

        x:
            (event.clientX - rect.left)
            * scaleX,

        y:
            (event.clientY - rect.top)
            * scaleY
    };
}


// ==========================
// MOUSE + TOUCH
// ==========================

let activePointers = {};


canvas.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();


        const position =
            getCanvasPosition(event);


        let playerNumber;


        if (
            position.x <
            canvas.width / 2
        ) {

            playerNumber = 1;

        } else {

            playerNumber = 2;
        }


        activePointers[event.pointerId] =
            playerNumber;


        canvas.setPointerCapture(
            event.pointerId
        );


        movePlayer(
            playerNumber,
            position.x,
            position.y
        );
    }
);


canvas.addEventListener(
    "pointermove",
    function(event) {

        const playerNumber =
            activePointers[
                event.pointerId
            ];


        if (
            playerNumber === undefined
        ) {

            return;
        }


        event.preventDefault();


        const position =
            getCanvasPosition(event);


        movePlayer(
            playerNumber,
            position.x,
            position.y
        );
    }
);


canvas.addEventListener(
    "pointerup",
    function(event) {

        delete activePointers[
            event.pointerId
        ];
    }
);


canvas.addEventListener(
    "pointercancel",
    function(event) {

        delete activePointers[
            event.pointerId
        ];
    }
);


// ==========================
// MOVE PLAYER
// ==========================

function movePlayer(
    playerNumber,
    x,
    y
) {

    if (playerNumber === 1) {

        player1.x = x;
        player1.y = y;

        limitPaddle(
            player1,
            1
        );

    } else {

        player2.x = x;
        player2.y = y;

        limitPaddle(
            player2,
            2
        );
    }


    if (gameStarted === false) {

        drawField();
    }
}


// ==========================
// GAME LOOP
// ==========================

function gameLoop() {

    if (gameStarted === false) {

        return;
    }


    movePuck();

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

        if (gameStarted === true) {

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
// RESTART
// ==========================

restartButton.addEventListener(
    "click",
    function() {

        playSound(clickSound);


        gameStarted = false;

        cancelAnimationFrame(
            animationId
        );


        player1 = {
            x: 120,
            y: canvas.height / 2
        };


        player2 = {
            x: canvas.width - 120,
            y: canvas.height / 2
        };


        resetPuck(
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

        score1Text.textContent = "0";
        score2Text.textContent = "0";


        gameStarted = false;

        cancelAnimationFrame(
            animationId
        );


        player1 = {
            x: 120,
            y: canvas.height / 2
        };


        player2 = {
            x: canvas.width - 120,
            y: canvas.height / 2
        };


        resetPuck(1);

        message.textContent = "";


        startButton.textContent =
            "▶ Start Game";

        startButton.style.display =
            "block";


        drawField();
    }
);


// ==========================
// INITIAL SCREEN
// ==========================

drawField();