(() => {
    "use strict";

    /* 
       FLAPPY BIRD
        */

    const canvas = document.getElementById("flappyCanvas");
    const canvasWrap = document.getElementById("flappyCanvasWrap");
    const ctx = canvas ? canvas.getContext("2d") : null;

    const scoreEl = document.getElementById("flappyScore");
    const levelEl = document.getElementById("flappyLevel");
    const bestEl = document.getElementById("flappyBest");

    const overlay = document.getElementById("flappyOverlay");
    const overlayTitle = document.getElementById("flappyOverlayTitle");
    const overlayText = document.getElementById("flappyOverlayText");

    const startButton = document.getElementById("flappyStartButton");
    const tapButton = document.getElementById("flappyTapButton");
    const restartButton = document.getElementById("flappyRestartButton");

    const gameTabDino = document.getElementById("gameTabDino");
    const gameTabFlappy = document.getElementById("gameTabFlappy");

    const dinoGameView = document.getElementById("dinoGameView");
    const flappyGameView = document.getElementById("flappyGameView");

    const dinoModal = document.getElementById("dinoModal");


    /* 
       SAFETY CHECK
        */

    if (!canvas || !canvasWrap || !ctx) {
        console.warn("Flappy: canvas atau canvas wrapper tidak ditemukan.");
        return;
    }


    /* 
       CONSTANTS
        */

    const BASE_GRAVITY = 0.34;
    const BASE_FLAP = -6.7;
    const BASE_PIPE_SPEED = 2.6;

    const PIPE_WIDTH = 62;

    const MIN_GAP = 118;
    const MAX_GAP = 175;

    const LEVEL_SCORE = 5;
    const MAX_LEVEL = 12;

    const STORAGE_KEY = "diniFlappyBest";


    /* 
       CANVAS
        */

    let canvasWidth = 360;
    let canvasHeight = 520;
    let dpr = 1;


    /* 
       GAME STATE
        */

    let running = false;
    let gameOver = false;

    let score = 0;
    let best = Number(localStorage.getItem(STORAGE_KEY) || 0);

    let level = 1;

    let animationFrame = null;

    let lastTime = 0;

    let backgroundOffset = 0;

    let groundOffset = 0;


    /* 
       HELPERS
        */

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }


    function random(min, max) {
        return Math.random() * (max - min) + min;
    }


    function formatScore(value) {
        return String(Math.max(0, Math.floor(value))).padStart(2, "0");
    }


    function updateLevel() {
        level = clamp(
            Math.floor(score / LEVEL_SCORE) + 1,
            1,
            MAX_LEVEL
        );
    }


    function getPipeSpeed() {
        return BASE_PIPE_SPEED + (level - 1) * 0.28;
    }


    function getPipeGap() {
        return clamp(
            MAX_GAP - (level - 1) * 4.5,
            MIN_GAP,
            MAX_GAP
        );
    }


    function getGravity() {
        return BASE_GRAVITY + (level - 1) * 0.012;
    }


    function getFlapPower() {
        return BASE_FLAP - (level - 1) * 0.04;
    }


    /* 
       SCORE UI
        */

    function updateScoreUI() {
        if (scoreEl) {
            scoreEl.textContent = formatScore(score);
        }

        if (levelEl) {
            levelEl.textContent = "LEVEL " + level;
        }

        if (bestEl) {
            bestEl.textContent = "BEST " + formatScore(best);
        }
    }


    /* 
       RESIZE
        */

    function resizeCanvas() {
        const rect = canvasWrap.getBoundingClientRect();

        canvasWidth = Math.max(280, Math.floor(rect.width || 360));

        canvasHeight = Math.max(
            300,
            Math.floor(rect.height || canvasWidth * 1.45)
        );

        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(canvasWidth * dpr);
        canvas.height = Math.floor(canvasHeight * dpr);

        canvas.style.width = canvasWidth + "px";
        canvas.style.height = canvasHeight + "px";

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        resetBackground();

        if (!running) {
            bird.x = canvasWidth * 0.28;
            bird.y = canvasHeight * 0.42;
        }
    }


    /* 
       BACKGROUND
        */

    const clouds = [];
    const stars = [];

    function resetBackground() {
        clouds.length = 0;
        stars.length = 0;

        const cloudCount = Math.max(
            3,
            Math.floor(canvasWidth / 130)
        );

        const starCount = Math.max(
            10,
            Math.floor(canvasWidth / 25)
        );

        for (let i = 0; i < cloudCount; i++) {
            clouds.push({
                x: random(0, canvasWidth),
                y: random(40, canvasHeight * 0.42),
                width: random(55, 110),
                height: random(18, 35),
                speed: random(0.08, 0.22)
            });
        }

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: random(0, canvasWidth),
                y: random(10, canvasHeight * 0.55),
                size: random(0.6, 1.8),
                alpha: random(0.2, 0.8)
            });
        }
    }


    function updateBackground(delta) {
        backgroundOffset += delta * 0.018;

        for (const cloud of clouds) {
            cloud.x -= cloud.speed * delta * 0.06;

            if (cloud.x + cloud.width < 0) {
                cloud.x = canvasWidth + random(20, 100);
                cloud.y = random(40, canvasHeight * 0.42);
            }
        }
    }


    function drawBackground() {
        /* Sky */

        const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            canvasHeight
        );

        gradient.addColorStop(0, "#151526");
        gradient.addColorStop(0.55, "#28233d");
        gradient.addColorStop(1, "#3a2940");

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            canvasWidth,
            canvasHeight
        );


        /* Stars */

        for (const star of stars) {
            ctx.globalAlpha = star.alpha;

            ctx.fillStyle = "#ffffff";

            ctx.beginPath();

            ctx.arc(
                star.x,
                star.y,
                star.size,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.globalAlpha = 1;


        /* Moon */

        const moonX = canvasWidth * 0.78;
        const moonY = canvasHeight * 0.17;
        const moonRadius = Math.min(
            35,
            canvasWidth * 0.1
        );

        ctx.save();

        ctx.shadowBlur = 25;
        ctx.shadowColor = "rgba(255,255,255,.25)";

        ctx.fillStyle = "rgba(255,245,220,.95)";

        ctx.beginPath();

        ctx.arc(
            moonX,
            moonY,
            moonRadius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();


        /* Clouds */

        for (const cloud of clouds) {
            drawCloud(
                cloud.x,
                cloud.y,
                cloud.width,
                cloud.height
            );
        }


        /* Distant hills */

        drawHills();
    }


    function drawCloud(x, y, width, height) {
        ctx.save();

        ctx.globalAlpha = 0.13;

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();

        ctx.ellipse(
            x + width * 0.25,
            y + height * 0.58,
            width * 0.24,
            height * 0.4,
            0,
            0,
            Math.PI * 2
        );

        ctx.ellipse(
            x + width * 0.5,
            y + height * 0.42,
            width * 0.3,
            height * 0.55,
            0,
            0,
            Math.PI * 2
        );

        ctx.ellipse(
            x + width * 0.75,
            y + height * 0.58,
            width * 0.25,
            height * 0.4,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }


    function drawHills() {
        const horizon = canvasHeight * 0.72;

        ctx.save();

        ctx.fillStyle = "rgba(15,13,27,.55)";

        ctx.beginPath();

        ctx.moveTo(0, canvasHeight);

        ctx.lineTo(0, horizon);

        for (
            let x = 0;
            x <= canvasWidth + 100;
            x += 80
        ) {
            const y =
                horizon -
                Math.sin(
                    (x + backgroundOffset * 8) * 0.025
                ) * 25 -
                20;

            ctx.lineTo(x, y);
        }

        ctx.lineTo(canvasWidth, canvasHeight);

        ctx.closePath();

        ctx.fill();

        ctx.restore();
    }


    /* 
       BIRD
        */

    const bird = {
        x: 0,
        y: 0,

        width: 34,
        height: 26,

        velocity: 0,

        rotation: 0,

        wingTime: 0
    };


    function resetBird() {
        bird.x = canvasWidth * 0.28;
        bird.y = canvasHeight * 0.42;

        bird.velocity = 0;

        bird.rotation = 0;

        bird.wingTime = 0;
    }


    function updateBird(delta) {
        bird.velocity += getGravity() * delta;

        bird.y += bird.velocity * delta;

        bird.wingTime += delta * 0.18;

        const targetRotation = clamp(
            bird.velocity * 0.09,
            -0.45,
            1.15
        );

        bird.rotation +=
            (targetRotation - bird.rotation) *
            Math.min(1, delta * 0.12);


        /* Ceiling */

        if (bird.y - bird.height / 2 < 0) {
            bird.y = bird.height / 2;

            bird.velocity = 0;
        }


        /* Ground */

        const groundHeight = getGroundHeight();

        if (
            bird.y + bird.height / 2 >=
            canvasHeight - groundHeight
        ) {
            bird.y =
                canvasHeight -
                groundHeight -
                bird.height / 2;

            triggerGameOver();
        }
    }


    function drawBird() {
        const wing =
            Math.sin(bird.wingTime) * 0.22;

        ctx.save();

        ctx.translate(
            bird.x,
            bird.y
        );

        ctx.rotate(bird.rotation);

        /* Shadow */

        ctx.shadowColor =
            "rgba(0,0,0,.35)";

        ctx.shadowBlur = 10;

        /* Body */

        ctx.fillStyle = "#f58fa8";

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            bird.width * 0.5,
            bird.height * 0.5,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* Wing */

        ctx.save();

        ctx.rotate(wing);

        ctx.fillStyle = "#df718f";

        ctx.beginPath();

        ctx.ellipse(
            -5,
            5,
            11,
            7,
            -0.25,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();


        /* Eye */

        ctx.shadowBlur = 0;

        ctx.fillStyle = "#ffffff";

        ctx.beginPath();

        ctx.arc(
            9,
            -6,
            5,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#171522";

        ctx.beginPath();

        ctx.arc(
            10.5,
            -6,
            2.2,
            0,
            Math.PI * 2
        );

        ctx.fill();


        /* Beak */

        ctx.fillStyle = "#ffd3a8";

        ctx.beginPath();

        ctx.moveTo(
            bird.width * 0.45,
            -1
        );

        ctx.lineTo(
            bird.width * 0.72,
            4
        );

        ctx.lineTo(
            bird.width * 0.45,
            8
        );

        ctx.closePath();

        ctx.fill();


        /* Small blush */

        ctx.fillStyle =
            "rgba(255,150,180,.45)";

        ctx.beginPath();

        ctx.arc(
            7,
            5,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }


    /* 
       PIPES
        */

    const pipes = [];


    function resetPipes() {
        pipes.length = 0;

        const firstX =
            canvasWidth + 120;

        createPipe(firstX);
        createPipe(firstX + canvasWidth * 0.62);
    }


    function createPipe(x) {
        const groundHeight = getGroundHeight();

        const gap = getPipeGap();

        const safeTop = 65;

        const safeBottom =
            canvasHeight -
            groundHeight -
            65;

        const maxTop =
            Math.max(
                safeTop,
                safeBottom - gap
            );

        const gapY = random(
            safeTop,
            maxTop
        );

        pipes.push({
            x,

            gapY,

            gap,

            passed: false
        });
    }


    function updatePipes(delta) {
        const speed = getPipeSpeed();

        for (const pipe of pipes) {
            pipe.x -= speed * delta;
        }


        const lastPipe =
            pipes[pipes.length - 1];

        if (
            lastPipe &&
            lastPipe.x <
                canvasWidth -
                canvasWidth * 0.35
        ) {
            createPipe(
                lastPipe.x +
                Math.max(
                    190,
                    canvasWidth * 0.58
                )
            );
        }


        while (
            pipes.length &&
            pipes[0].x + PIPE_WIDTH < 0
        ) {
            pipes.shift();
        }


        for (const pipe of pipes) {
            if (
                !pipe.passed &&
                pipe.x + PIPE_WIDTH < bird.x
            ) {
                pipe.passed = true;

                score++;

                updateLevel();

                if (score > best) {
                    best = score;

                    localStorage.setItem(
                        STORAGE_KEY,
                        String(best)
                    );
                }

                updateScoreUI();
            }
        }
    }


    function drawPipe(pipe) {
        const topHeight = pipe.gapY;

        const bottomY =
            pipe.gapY + pipe.gap;

        const groundHeight =
            getGroundHeight();

        const bottomHeight =
            canvasHeight -
            groundHeight -
            bottomY;


        /* Pipe body */

        ctx.fillStyle = "#8c5470";

        ctx.fillRect(
            pipe.x,
            0,
            PIPE_WIDTH,
            topHeight
        );

        ctx.fillRect(
            pipe.x,
            bottomY,
            PIPE_WIDTH,
            bottomHeight
        );


        /* Pipe highlight */

        ctx.fillStyle =
            "rgba(255,255,255,.12)";

        ctx.fillRect(
            pipe.x + 7,
            0,
            7,
            topHeight
        );

        ctx.fillRect(
            pipe.x + 7,
            bottomY,
            7,
            bottomHeight
        );


        /* Top cap */

        ctx.fillStyle = "#a66382";

        ctx.fillRect(
            pipe.x - 5,
            topHeight - 18,
            PIPE_WIDTH + 10,
            18
        );


        /* Bottom cap */

        ctx.fillRect(
            pipe.x - 5,
            bottomY,
            PIPE_WIDTH + 10,
            18
        );


        /* Cap highlight */

        ctx.fillStyle =
            "rgba(255,255,255,.13)";

        ctx.fillRect(
            pipe.x,
            topHeight - 15,
            PIPE_WIDTH,
            4
        );

        ctx.fillRect(
            pipe.x,
            bottomY + 3,
            PIPE_WIDTH,
            4
        );
    }


    /* 
       GROUND
        */

    function getGroundHeight() {
        return clamp(
            canvasHeight * 0.085,
            38,
            58
        );
    }


    function updateGround(delta) {
        groundOffset +=
            getPipeSpeed() *
            delta;
    }


    function drawGround() {
        const groundHeight =
            getGroundHeight();

        const y =
            canvasHeight -
            groundHeight;


        /* Ground */

        ctx.fillStyle = "#201a29";

        ctx.fillRect(
            0,
            y,
            canvasWidth,
            groundHeight
        );


        /* Grass/top line */

        ctx.fillStyle = "#d07898";

        ctx.fillRect(
            0,
            y,
            canvasWidth,
            5
        );


        /* Moving pattern */

        const tile = 32;

        const offset =
            groundOffset % tile;

        ctx.fillStyle =
            "rgba(255,255,255,.07)";

        for (
            let x = -tile + offset;
            x < canvasWidth + tile;
            x += tile
        ) {
            ctx.fillRect(
                x,
                y + 12,
                15,
                4
            );
        }


        /* Bottom line */

        ctx.fillStyle =
            "rgba(0,0,0,.3)";

        ctx.fillRect(
            0,
            canvasHeight - 6,
            canvasWidth,
            6
        );
    }


    /* 
       COLLISION
        */

    function checkCollision() {
        const birdLeft =
            bird.x -
            bird.width * 0.36;

        const birdRight =
            bird.x +
            bird.width * 0.36;

        const birdTop =
            bird.y -
            bird.height * 0.36;

        const birdBottom =
            bird.y +
            bird.height * 0.36;


        for (const pipe of pipes) {
            const pipeLeft =
                pipe.x;

            const pipeRight =
                pipe.x + PIPE_WIDTH;


            if (
                birdRight > pipeLeft &&
                birdLeft < pipeRight
            ) {
                const hitsTop =
                    birdTop <
                    pipe.gapY;

                const hitsBottom =
                    birdBottom >
                    pipe.gapY +
                    pipe.gap;

                if (
                    hitsTop ||
                    hitsBottom
                ) {
                    return true;
                }
            }
        }

        return false;
    }


    /* 
       RESET
        */

   function resetGameState() {
    score = 0;
    level = 1;

    gameOver = false;

    lastTime = 0;

    backgroundOffset = 0;
    groundOffset = 0;

    resetBird();
    resetPipes();

    updateScoreUI();

    // Pastikan tulisan GAME OVER benar-benar hilang
    hideOverlay();
}


    /* 
       OVERLAY
        */

  function showOverlay(title, text) {
    if (!overlay) {
        return;
    }

    if (overlayTitle) {
        overlayTitle.textContent = title;
    }

    if (overlayText) {
        overlayText.textContent = text;
    }

    overlay.hidden = false;

    overlay.setAttribute(
        "aria-hidden",
        "false"
    );

    // Tampilkan kembali overlay
    overlay.style.display = "";
}


   function hideOverlay() {
    if (!overlay) {
        return;
    }

    overlay.hidden = true;

    overlay.setAttribute(
        "aria-hidden",
        "true"
    );

    // Tambahan supaya CSS display tidak tetap memunculkan overlay
    overlay.style.display = "none";
}


    /* 
       START GAME
        */

  function startGame() {
    if (running) {
        return;
    }

    cancelAnimationFrame(animationFrame);

    // Reset semua kondisi game
    resetGameState();

    running = true;
    gameOver = false;

    // Paksa overlay hilang
    hideOverlay();

    // Lompatan pertama saat mulai
    bird.velocity = getFlapPower();
    bird.rotation = -0.45;

    lastTime = performance.now();

    animationFrame = requestAnimationFrame(gameLoop);
}


    /* 
       GAME OVER
        */

    function triggerGameOver() {
        if (gameOver) {
            return;
        }

        gameOver = true;

        running = false;

        if (score > best) {
            best = score;

            localStorage.setItem(
                STORAGE_KEY,
                String(best)
            );
        }

        updateScoreUI();

        showOverlay(
            "GAME OVER",
            "Skor kamu " +
            formatScore(score) +
            " • Tekan ulang untuk bermain lagi."
        );

        draw();
    }


    /* 
       RESTART
        */

   function restartGame() {
    cancelAnimationFrame(animationFrame);

    running = false;
    gameOver = false;

    resetGameState();

    startGame();
}


    /* 
       FLAP
        */

    function flap() {
    if (gameOver) {
        restartGame();
        return;
    }

    if (!running) {
        startGame();
        return;
    }

    bird.velocity = getFlapPower();
    bird.rotation = -0.45;
}

    /* 
       UPDATE
        */

    function update(delta) {
        updateBackground(delta);

        updateBird(delta);

        if (gameOver) {
            return;
        }

        updatePipes(delta);

        updateGround(delta);

        if (checkCollision()) {
            triggerGameOver();
        }
    }


    /* 
       DRAW
        */

    function draw() {
        ctx.clearRect(
            0,
            0,
            canvasWidth,
            canvasHeight
        );

        drawBackground();

        for (const pipe of pipes) {
            drawPipe(pipe);
        }

        drawGround();

        drawBird();
    }


    /* 
       GAME LOOP
        */

    function gameLoop(timestamp) {
        if (!running) {
            draw();

            return;
        }

        let delta =
            (timestamp - lastTime) / 16.6667;

        lastTime = timestamp;

        /*
         * Mencegah game meloncat terlalu jauh
         * ketika browser sedang lag / tab berpindah.
         */

        delta = clamp(
            delta,
            0,
            2
        );

        update(delta);

        draw();

        if (running) {
            animationFrame =
                requestAnimationFrame(
                    gameLoop
                );
        }
    }


    /* 
       KEYBOARD
        */

    function handleKeyboard(event) {
        const target =
            event.target;

        /*
         * Jangan ganggu input/form lain
         * di halaman birthday.
         */

        if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement ||
            target.isContentEditable
        ) {
            return;
        }


        const key =
            event.key.toLowerCase();


        if (
            key === " " ||
            key === "arrowup" ||
            key === "w"
        ) {
            event.preventDefault();

            flap();
        }


        if (
            key === "enter" &&
            !running
        ) {
            event.preventDefault();

            if (gameOver) {
                restartGame();
            } else {
                startGame();
            }
        }
    }


    /* 
       POINTER / TOUCH
        */

    function handlePointer(event) {
        /*
         * Jangan trigger ketika user menekan
         * tombol overlay.
         */

        const target =
            event.target;

        if (
            target &&
            (
                target.closest(".flappy-overlay") ||
                target.closest(
                    "#flappyStartButton"
                ) ||
                target.closest(
                    "#flappyRestartButton"
                )
            )
        ) {
            return;
        }

        event.preventDefault();

        flap();
    }


    /* 
       BUTTONS
        */

    if (startButton) {
        startButton.addEventListener(
            "click",
            event => {
                event.preventDefault();

                startGame();
            }
        );
    }


    if (restartButton) {
        restartButton.addEventListener(
            "click",
            event => {
                event.preventDefault();

                restartGame();
            }
        );
    }


    if (tapButton) {
        tapButton.addEventListener(
            "pointerdown",
            event => {
                event.preventDefault();

                flap();
            }
        );
    }


    /* 
       CANVAS INPUT
        */

    canvas.addEventListener(
        "pointerdown",
        handlePointer,
        {
            passive: false
        }
    );


    /*
     * Wrapper juga diberi input agar area game
     * tetap mudah disentuh di HP.
     */

    canvasWrap.addEventListener(
        "pointerdown",
        handlePointer,
        {
            passive: false
        }
    );


    document.addEventListener(
        "keydown",
        handleKeyboard,
        {
            passive: false
        }
    );


    /* 
       TAB DINO / FLAPPY
        */

    function showDino() {
        if (dinoGameView) {
            dinoGameView.hidden = false;
        }

        if (flappyGameView) {
            flappyGameView.hidden = true;
        }


        if (gameTabDino) {
            gameTabDino.classList.add(
                "active"
            );

            gameTabDino.setAttribute(
                "aria-selected",
                "true"
            );
        }


        if (gameTabFlappy) {
            gameTabFlappy.classList.remove(
                "active"
            );

            gameTabFlappy.setAttribute(
                "aria-selected",
                "false"
            );
        }


        /*
         * Hentikan animasi Flappy ketika
         * user pindah ke Dino.
         */

        if (running) {
            running = false;

            cancelAnimationFrame(
                animationFrame
            );
        }
    }


    function showFlappy() {
        if (dinoGameView) {
            dinoGameView.hidden = true;
        }

        if (flappyGameView) {
            flappyGameView.hidden = false;
        }


        if (gameTabDino) {
            gameTabDino.classList.remove(
                "active"
            );

            gameTabDino.setAttribute(
                "aria-selected",
                "false"
            );
        }


        if (gameTabFlappy) {
            gameTabFlappy.classList.add(
                "active"
            );

            gameTabFlappy.setAttribute(
                "aria-selected",
                "true"
            );
        }


        /*
         * Tunggu sampai layout benar-benar
         * terlihat sebelum mengukur canvas.
         */

        requestAnimationFrame(() => {
            resizeCanvas();

            draw();
        });
    }


    if (gameTabDino) {
        gameTabDino.addEventListener(
            "click",
            showDino
        );
    }


    if (gameTabFlappy) {
        gameTabFlappy.addEventListener(
            "click",
            showFlappy
        );
    }


    /* 
       WINDOW RESIZE
        */

    window.addEventListener(
        "resize",
        () => {
            resizeCanvas();

            draw();
        }
    );


    /* 
       ORIENTATION CHANGE
        */

    window.addEventListener(
        "orientationchange",
        () => {
            setTimeout(() => {
                resizeCanvas();

                draw();
            }, 150);
        }
    );


    /* 
       DINO MODAL OBSERVER
        */

    if (dinoModal) {
        const observer =
            new MutationObserver(() => {
                requestAnimationFrame(() => {
                    resizeCanvas();

                    draw();
                });
            });

        observer.observe(
            dinoModal,
            {
                attributes: true,
                attributeFilter: [
                    "class",
                    "aria-hidden",
                    "style"
                ]
            }
        );
    }


    /* 
       VISIBILITY CHANGE
        */

    document.addEventListener(
        "visibilitychange",
        () => {
            if (
                document.hidden &&
                running
            ) {
                running = false;

                cancelAnimationFrame(
                    animationFrame
                );
            }
        }
    );


    /* 
       INITIALIZATION
        */

    bestEl &&
        (bestEl.textContent =
            "BEST " +
            formatScore(best));

    updateScoreUI();

    resizeCanvas();

    resetGameState();

    draw();

})();