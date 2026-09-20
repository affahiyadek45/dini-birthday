/*
 * DINO LOVE GAME — floating modal, progressive difficulty
 * Mobile-safe controls
 *
 * TAP GAME       = LOMPAT
 * SPACE / ↑      = LOMPAT
 * ←              = GERAK KIRI
 * →              = GERAK KANAN
 * HOLD ← / →     = GERAK TERUS
 */

(() => {
    function initDinoGame() {

        const $ = id => document.getElementById(id);

        /*
           ELEMENTS
        */

        const modal = $("dinoModal");
        const openButton = $("dinoFloatChat");
        const closeButton = $("dinoModalClose");
        const backdrop = $("dinoModalBackdrop");

        const canvas = $("dinoCanvas");
        const wrap = $("dinoCanvasWrap");

        const startButton = $("dinoStartButton");
        const restartButton = $("dinoRestartButton");

        const overlay = $("dinoOverlay");
        const overlayTitle = $("dinoOverlayTitle");
        const overlayText = $("dinoOverlayText");

        const scoreEl = $("dinoScore");
        const levelEl = $("dinoLevel");
        const bestEl = $("dinoBest");

        const leftButton = $("dinoLeftButton");
        const rightButton = $("dinoRightButton");

        if (!modal || !canvas || !wrap) {
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            return;
        }


        /*
           GAME STATE
        */

        let W = 1000;
        let H = 360;
        let DPR = 1;

        let running = false;

        let animationId = 0;
        let lastTime = 0;

        let score = 0;

        let best = Number(
            localStorage.getItem("diniDinoBest") || 0
        );

        let speed = 6;
        let level = 1;

        let spawnTimer = 0;
        let nextSpawn = 1050;

        let groundOffset = 0;
        let cloudOffset = 0;

        let obstacles = [];


        /*
           DINO
        */

        const dino = {
            x: 100,
            y: 0,
            w: 48,
            h: 60,
            vy: 0,
            jumping: false
        };


        /*
           MOBILE MOVEMENT
        */

        let moveDirection = 0;
        let moveAnimationId = 0;


        /*
           GROUND
        */

        function groundY() {
            return H - Math.max(48, H * 0.16);
        }


        /*
           RESIZE
        */

        function resize() {

            const rect = wrap.getBoundingClientRect();

            DPR = Math.min(
                window.devicePixelRatio || 1,
                2
            );

            W = Math.max(
                360,
                Math.floor(rect.width)
            );

            H = Math.max(
                260,
                Math.floor(rect.height)
            );

            canvas.width = Math.floor(W * DPR);
            canvas.height = Math.floor(H * DPR);

            canvas.style.width = W + "px";
            canvas.style.height = H + "px";

            ctx.setTransform(
                DPR,
                0,
                0,
                DPR,
                0,
                0
            );

            dino.w = Math.max(
                40,
                Math.min(56, W * 0.045)
            );

            dino.h = dino.w * 1.24;

            dino.x = Math.max(
                45,
                Math.min(
                    dino.x,
                    W - dino.w - 20
                )
            );

            if (!running) {
                reset(false);
            }

            draw();
        }


        /*
           RESET
        */

        function reset(showOverlay = true) {

            score = 0;

            level = 1;

            speed = Math.max(
                5.8,
                W / 175
            );

            spawnTimer = 0;

            nextSpawn = 1000;

            groundOffset = 0;

            cloudOffset = 0;

            obstacles = [];

            dino.vy = 0;

            dino.jumping = false;

            dino.x = Math.max(
                45,
                W * 0.085
            );

            dino.y =
                groundY() -
                dino.h;

            stopMoving();

            updateHud();

            if (showOverlay) {
                overlay.classList.remove(
                    "is-hidden"
                );
            }
        }


        /*
           HUD
        */

        function updateHud() {

            scoreEl.textContent =
                "SCORE " +
                String(
                    Math.floor(score)
                ).padStart(5, "0");

            levelEl.textContent =
                "LEVEL " +
                String(level).padStart(2, "0");

            bestEl.textContent =
                "BEST " +
                String(
                    Math.max(
                        best,
                        Math.floor(score)
                    )
                ).padStart(5, "0");
        }


        /*
           OPEN GAME
        */

        function openGame() {

            modal.classList.add(
                "is-open"
            );

            modal.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "dino-modal-open"
            );

            setTimeout(() => {
                resize();
            }, 40);
        }


        /*
           CLOSE GAME
        */

        function closeGame() {

            modal.classList.remove(
                "is-open"
            );

            modal.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.classList.remove(
                "dino-modal-open"
            );

            stopMoving();

            if (running) {

                running = false;

                cancelAnimationFrame(
                    animationId
                );
            }
        }


        /*
           START GAME
        */

        function startGame() {

            if (running) {
                return;
            }

            reset(false);

            running = true;

            overlay.classList.add(
                "is-hidden"
            );

            startButton.textContent =
                "MAIN LAGI ♡";

            lastTime =
                performance.now();

            cancelAnimationFrame(
                animationId
            );

            animationId =
                requestAnimationFrame(
                    loop
                );
        }


        /*
           GAME OVER
        */

        function gameOver() {

            running = false;

            stopMoving();

            const finalScore =
                Math.floor(score);

            if (finalScore > best) {

                best = finalScore;

                localStorage.setItem(
                    "diniDinoBest",
                    String(best)
                );
            }

            updateHud();

            overlay.classList.remove(
                "is-hidden"
            );

            overlayTitle.textContent =
                "Aduh, ketabrak ♡";

            overlayText.textContent =
                `Skormu ${finalScore}. Level ${level}. Coba lagi dan pecahkan rekor ${best}.`;

            startButton.textContent =
                "MAIN LAGI ♡";
        }


        /*
           JUMP
        */

        function jump() {

            if (!running) {
                startGame();
                return;
            }

            if (!dino.jumping) {

                dino.vy =
                    -Math.max(
                        13,
                        H * 0.045
                    );

                dino.jumping = true;
            }
        }


        /*
           LEVEL
        */

        function currentLevel() {

            return Math.min(
                12,
                1 + Math.floor(
                    score / 90
                )
            );
        }


        /*
           SPAWN OBSTACLE
        */

        function spawn(type = null) {

            const birdUnlocked =
                level >= 3;

            const roll =
                Math.random();

            const chosen =
                type ||
                (
                    birdUnlocked &&
                    roll <
                        Math.min(
                            0.34,
                            0.10 +
                            level * 0.025
                        )
                        ? "bird"
                        : roll < 0.25
                            ? "heart"
                            : "cactus"
                );


            /*
               BIRD
            */

            if (chosen === "bird") {

                const h = 25;
                const w = 48;

                obstacles.push({
                    type: "bird",

                    x: W + 30,

                    y:
                        groundY() -
                        h -
                        (
                            58 +
                            Math.random() * 55
                        ),

                    w,
                    h,

                    passed: false,

                    flap:
                        Math.random() * 6
                });

                return;
            }


            /*
               CACTUS / HEART
            */

            const tall =
                Math.random() <
                Math.min(
                    0.65,
                    0.22 +
                    level * 0.045
                );

            const h =
                chosen === "heart"
                    ? 30
                    : (
                        tall
                            ? 58
                            : 43
                    );

            const w =
                chosen === "heart"
                    ? 31
                    : (
                        tall
                            ? 34
                            : 26
                    );

            obstacles.push({
                type: chosen,

                x: W + 30,

                y:
                    groundY() - h,

                w,
                h,

                passed: false
            });


            /*
               SECOND OBSTACLE
            */

            if (
                level >= 4 &&
                Math.random() <
                Math.min(
                    0.24,
                    0.05 +
                    level * 0.018
                )
            ) {

                const gap =
                    75 +
                    Math.random() * 75;

                const h2 =
                    35 +
                    Math.random() * 20;

                obstacles.push({

                    type: "cactus",

                    x:
                        W +
                        30 +
                        gap,

                    y:
                        groundY() -
                        h2,

                    w: 25,

                    h: h2,

                    passed: false
                });
            }
        }


        /*
           HITBOX
        */

        function hitboxDino() {

            return {
                x: dino.x + 7,

                y: dino.y + 6,

                w: dino.w - 13,

                h: dino.h - 10
            };
        }


        function hitbox(o) {

            if (o.type === "bird") {

                return {
                    x: o.x + 5,

                    y: o.y + 6,

                    w: o.w - 10,

                    h: o.h - 10
                };
            }

            return {
                x: o.x + 4,

                y: o.y + 4,

                w: o.w - 8,

                h: o.h - 7
            };
        }


        function overlap(a, b) {

            return (
                a.x <
                    b.x + b.w &&

                a.x + a.w >
                    b.x &&

                a.y <
                    b.y + b.h &&

                a.y + a.h >
                    b.y
            );
        }


        /*
           UPDATE GAME
        */

        function update(dt) {

            const step =
                dt / 16.67;


            /* SCORE */

            score +=
                dt * 0.0125;


            /* LEVEL */

            level =
                currentLevel();


            /* SPEED */

            speed =
                Math.min(
                    15.5,

                    Math.max(
                        5.8,
                        W / 175
                    ) +

                    (level - 1) *
                        0.72 +

                    score *
                        0.0012
                );


            /* GROUND */

            groundOffset =
                (
                    groundOffset +
                    speed * step
                ) % 42;


            /* CLOUD */

            cloudOffset =
                (
                    cloudOffset +
                    speed *
                    0.07 *
                    step
                ) %
                (W + 250);


            /*
               MOBILE DINO MOVEMENT
            */

            if (moveDirection !== 0) {

                const moveAmount =
                    Math.max(
                        5,
                        W * 0.012
                    ) * step;

                dino.x +=
                    moveDirection *
                    moveAmount;

                const minX = 20;

                const maxX =
                    W -
                    dino.w -
                    20;

                dino.x =
                    Math.max(
                        minX,
                        Math.min(
                            maxX,
                            dino.x
                        )
                    );
            }


            /*
               GRAVITY
            */

            dino.vy +=
                0.72 * step;

            dino.y +=
                dino.vy * step;


            const floor =
                groundY() -
                dino.h;


            if (dino.y >= floor) {

                dino.y = floor;

                dino.vy = 0;

                dino.jumping = false;
            }


            /*
               SPAWN
            */

            spawnTimer += dt;

            if (
                spawnTimer >=
                nextSpawn
            ) {

                spawn();

                spawnTimer = 0;

                const difficulty =
                    Math.min(
                        480,
                        level * 42
                    );

                nextSpawn =
                    Math.max(
                        510,

                        1120 -
                        difficulty -
                        speed * 20 +

                        Math.random() *
                        430
                    );
            }


            /*
               OBSTACLES
            */

            for (
                let i =
                    obstacles.length - 1;

                i >= 0;

                i--
            ) {

                const o =
                    obstacles[i];


                o.x -=
                    speed * step;


                if (
                    o.type ===
                    "bird"
                ) {

                    o.flap +=
                        dt * 0.02;
                }


                /* PASS BONUS */

                if (
                    !o.passed &&
                    o.x + o.w <
                        dino.x
                ) {

                    o.passed = true;

                    score +=
                        o.type === "bird"
                            ? 14
                            : 8;
                }


                /* COLLISION */

                if (
                    overlap(
                        hitboxDino(),
                        hitbox(o)
                    )
                ) {

                    gameOver();

                    return;
                }


                /* REMOVE */

                if (
                    o.x + o.w <
                    -70
                ) {

                    obstacles.splice(
                        i,
                        1
                    );
                }
            }


            updateHud();
        }


        /*
           BACKGROUND
        */

        function drawBackground() {

            ctx.clearRect(
                0,
                0,
                W,
                H
            );


            const g =
                ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    H
                );

            g.addColorStop(
                0,
                "#171112"
            );

            g.addColorStop(
                1,
                "#0b0909"
            );

            ctx.fillStyle = g;

            ctx.fillRect(
                0,
                0,
                W,
                H
            );


            /* CLOUDS */

            ctx.globalAlpha = 0.18;

            ctx.fillStyle =
                "#d7aaa5";


            for (
                let i = 0;
                i < 6;
                i++
            ) {

                const x =
                    (
                        (
                            i * 240 -
                            cloudOffset
                        ) %
                        (W + 280)
                    ) - 130;

                const y =
                    45 +
                    (i % 3) * 34;


                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    25,
                    0,
                    Math.PI * 2
                );

                ctx.arc(
                    x + 30,
                    y + 2,
                    18,
                    0,
                    Math.PI * 2
                );

                ctx.arc(
                    x - 24,
                    y + 7,
                    16,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }


            ctx.globalAlpha = 1;


            /* GROUND */

            const ground =
                groundY();


            ctx.strokeStyle =
                "rgba(215,170,165,.27)";

            ctx.lineWidth = 1;


            ctx.beginPath();

            ctx.moveTo(
                0,
                ground + 1
            );

            ctx.lineTo(
                W,
                ground + 1
            );

            ctx.stroke();


            ctx.strokeStyle =
                "rgba(215,170,165,.10)";


            for (
                let x =
                    -groundOffset;

                x < W;

                x += 42
            ) {

                ctx.beginPath();

                ctx.moveTo(
                    x,
                    ground + 15
                );

                ctx.lineTo(
                    x + 17,
                    ground + 15
                );

                ctx.stroke();
            }


            /* LEVEL */

            ctx.fillStyle =
                "rgba(255,255,255,.16)";

            ctx.font =
                "10px Arial";

            ctx.fillText(
                "LEVEL " +
                String(level).padStart(
                    2,
                    "0"
                ),

                14,
                20
            );
        }


        /*
           DRAW DINO
        */

        function drawPlayer() {

            const x = dino.x;
            const y = dino.y;
            const w = dino.w;
            const h = dino.h;


            const leg =
                dino.jumping
                    ? 0
                    : Math.sin(
                        performance.now() /
                        70
                    ) * 4;


            ctx.save();


            ctx.fillStyle =
                "#e7b0b0";

            ctx.strokeStyle =
                "#f4d5d5";

            ctx.lineWidth = 1.5;


            /* BODY */

            ctx.beginPath();

            ctx.roundRect(
                x + 7,
                y + 14,
                w * 0.72,
                h * 0.60,
                8
            );

            ctx.fill();


            /* HEAD */

            ctx.beginPath();

            ctx.roundRect(
                x + w * 0.34,
                y + 4,
                w * 0.60,
                h * 0.46,
                8
            );

            ctx.fill();


            /* NOSE */

            ctx.fillRect(
                x + w * 0.76,
                y + 22,
                w * 0.30,
                h * 0.17
            );


            /* TAIL */

            ctx.beginPath();

            ctx.moveTo(
                x + 10,
                y + 26
            );

            ctx.lineTo(
                x - 8,
                y + 18
            );

            ctx.lineTo(
                x + 5,
                y + 35
            );

            ctx.closePath();

            ctx.fill();


            /* EYE */

            ctx.fillStyle =
                "#211719";

            ctx.beginPath();

            ctx.arc(
                x + w * 0.70,
                y + 16,
                2.5,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* HEART */

            ctx.fillStyle =
                "#9e626c";

            ctx.font =
                `${Math.max(
                    10,
                    w * 0.27
                )}px Arial`;

            ctx.fillText(
                "♥",
                x + w * 0.43,
                y + h * 0.48
            );


            /* LEGS */

            ctx.strokeStyle =
                "#e7b0b0";

            ctx.lineWidth = 4;

            ctx.lineCap =
                "round";


            ctx.beginPath();


            ctx.moveTo(
                x + w * 0.28,
                y + h * 0.70
            );

            ctx.lineTo(
                x + w * 0.24,
                y + h * 0.94 + leg
            );


            ctx.moveTo(
                x + w * 0.57,
                y + h * 0.70
            );

            ctx.lineTo(
                x + w * 0.62,
                y + h * 0.94 - leg
            );


            ctx.stroke();

            ctx.restore();
        }


        /*
           DRAW OBSTACLE
        */

        function drawObstacle(o) {

            ctx.save();


            /* HEART */

            if (
                o.type ===
                "heart"
            ) {

                const x =
                    o.x +
                    o.w / 2;

                const y =
                    o.y +
                    o.h * 0.55;

                const s =
                    o.w / 2;


                ctx.fillStyle =
                    "#d987a0";


                ctx.beginPath();


                ctx.moveTo(
                    x,
                    y + s
                );


                ctx.bezierCurveTo(
                    x - s * 1.5,
                    y,
                    x - s,
                    y - s,
                    x,
                    y - s * 0.15
                );


                ctx.bezierCurveTo(
                    x + s,
                    y - s,
                    x + s * 1.5,
                    y,
                    x,
                    y + s
                );


                ctx.fill();


            }


            /* BIRD */

            else if (
                o.type ===
                "bird"
            ) {

                const wing =
                    Math.sin(
                        o.flap
                    ) * 5;


                ctx.fillStyle =
                    "#d7aaa5";

                ctx.strokeStyle =
                    "#f1d4d1";

                ctx.lineWidth =
                    1.2;


                ctx.beginPath();

                ctx.ellipse(
                    o.x + 24,
                    o.y + 13,
                    17,
                    9,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
                ctx.stroke();


                /* LEFT WING */

                ctx.beginPath();

                ctx.moveTo(
                    o.x + 20,
                    o.y + 13
                );

                ctx.lineTo(
                    o.x + 3,
                    o.y + wing
                );

                ctx.lineTo(
                    o.x + 22,
                    o.y + 18
                );

                ctx.closePath();

                ctx.fill();


                /* RIGHT WING */

                ctx.beginPath();

                ctx.moveTo(
                    o.x + 30,
                    o.y + 13
                );

                ctx.lineTo(
                    o.x + 47,
                    o.y + 3 - wing
                );

                ctx.lineTo(
                    o.x + 34,
                    o.y + 19
                );

                ctx.closePath();

                ctx.fill();


                /* EYE */

                ctx.fillStyle =
                    "#211719";

                ctx.beginPath();

                ctx.arc(
                    o.x + 38,
                    o.y + 11,
                    2,
                    0,
                    Math.PI * 2
                );

                ctx.fill();


            }


            /* CACTUS */

            else {

                ctx.fillStyle =
                    "#b47d77";

                ctx.strokeStyle =
                    "#d5aaa5";

                ctx.lineWidth = 1;


                ctx.beginPath();


                ctx.roundRect(
                    o.x +
                        o.w * 0.28,
                    o.y,
                    o.w * 0.45,
                    o.h,
                    4
                );


                ctx.roundRect(
                    o.x,
                    o.y +
                        o.h * 0.35,
                    o.w * 0.38,
                    o.h * 0.14,
                    3
                );


                ctx.roundRect(
                    o.x +
                        o.w * 0.62,
                    o.y +
                        o.h * 0.2,
                    o.w * 0.38,
                    o.h * 0.14,
                    3
                );


                ctx.fill();

                ctx.stroke();
            }


            ctx.restore();
        }


        /*
           DRAW
        */

        function draw() {

            drawBackground();

            obstacles.forEach(
                drawObstacle
            );

            drawPlayer();
        }


        /*
           GAME LOOP
        */

        function loop(now) {

            if (!running) {

                draw();

                return;
            }


            const dt =
                Math.min(
                    32,
                    now -
                        lastTime ||
                        16.67
                );


            lastTime = now;


            update(dt);

            draw();


            if (running) {

                animationId =
                    requestAnimationFrame(
                        loop
                    );
            }
        }


        /*
           CANVAS INPUT
        */

        function jumpInput(e) {

            if (e) {
                e.preventDefault();
            }

            jump();
        }


        /*
           MOVE DINO
        */

        function moveDino(direction) {

            if (!running) {
                startGame();
            }

            moveDirection =
                direction;


            if (!moveAnimationId) {

                moveAnimationId =
                    requestAnimationFrame(
                        moveLoop
                    );
            }
        }


        /*
           CONTINUOUS MOVEMENT
        */

        function moveLoop() {

            if (
                moveDirection ===
                0
            ) {

                moveAnimationId = 0;

                return;
            }


            if (!running) {

                moveDirection = 0;

                moveAnimationId = 0;

                return;
            }


            const amount =
                Math.max(
                    5,
                    W * 0.012
                );


            dino.x +=
                moveDirection *
                amount;


            const minX = 20;

            const maxX =
                W -
                dino.w -
                20;


            dino.x =
                Math.max(
                    minX,
                    Math.min(
                        maxX,
                        dino.x
                    )
                );


            moveAnimationId =
                requestAnimationFrame(
                    moveLoop
                );
        }


        /*
           STOP MOVEMENT
        */

        function stopMoving() {

            moveDirection = 0;


            if (moveAnimationId) {

                cancelAnimationFrame(
                    moveAnimationId
                );

                moveAnimationId = 0;
            }


            leftButton?.classList.remove(
                "is-held"
            );

            rightButton?.classList.remove(
                "is-held"
            );
        }


        /*
           MOBILE BUTTON
           POINTER EVENTS ONLY
        */

        function bindMoveButton(
            button,
            direction
        ) {

            if (!button) {
                return;
            }


            const press = e => {

                e.preventDefault();


                try {

                    button.setPointerCapture?.(
                        e.pointerId
                    );

                } catch (_) {}


                moveDino(
                    direction
                );


                button.classList.add(
                    "is-held"
                );
            };


            const release = e => {

                e.preventDefault();

                stopMoving();
            };


            button.addEventListener(
                "pointerdown",
                press,
                {
                    passive: false
                }
            );


            button.addEventListener(
                "pointerup",
                release,
                {
                    passive: false
                }
            );


            button.addEventListener(
                "pointercancel",
                release,
                {
                    passive: false
                }
            );


            button.addEventListener(
                "pointerleave",
                e => {

                    if (
                        e.pointerType ===
                        "mouse"
                    ) {

                        stopMoving();
                    }
                },
                {
                    passive: false
                }
            );


            button.addEventListener(
                "lostpointercapture",
                release,
                {
                    passive: false
                }
            );


            button.addEventListener(
                "contextmenu",
                e => {
                    e.preventDefault();
                }
            );
        }


        /*
           OPEN / CLOSE / START
        */

        openButton?.addEventListener(
            "click",
            openGame
        );


        closeButton?.addEventListener(
            "click",
            closeGame
        );


        backdrop?.addEventListener(
            "click",
            closeGame
        );


        startButton?.addEventListener(
            "click",
            startGame
        );


        restartButton?.addEventListener(
            "click",
            startGame
        );


        /*
           CANVAS TAP = JUMP
        */

        wrap.addEventListener(
            "pointerdown",
            e => {

                /*
                 * Jangan jadikan tombol kiri/kanan
                 * sebagai jump.
                 */

                if (
                    e.target.closest(
                        ".dino-controls button"
                    )
                ) {

                    return;
                }


                jumpInput(e);

            },
            {
                passive: false
            }
        );


        /*
           BIND MOBILE BUTTONS
        */

        bindMoveButton(
            leftButton,
            -1
        );


        bindMoveButton(
            rightButton,
            1
        );


        /*
           KEYBOARD PC
        */

        window.addEventListener(
            "keydown",
            e => {

                if (
                    !modal.classList.contains(
                        "is-open"
                    )
                ) {

                    return;
                }


                /* SPACE / UP = JUMP */

                if (
                    e.code === "Space" ||
                    e.code === "ArrowUp"
                ) {

                    jumpInput(e);
                }


                /* LEFT */

                if (
                    e.code ===
                    "ArrowLeft"
                ) {

                    e.preventDefault();

                    moveDino(-1);
                }


                /* RIGHT */

                if (
                    e.code ===
                    "ArrowRight"
                ) {

                    e.preventDefault();

                    moveDino(1);
                }


                /* ESC */

                if (
                    e.code ===
                    "Escape"
                ) {

                    closeGame();
                }

            },
            {
                passive: false
            }
        );


        /*
           STOP MOVEMENT WHEN WINDOW LOSES FOCUS
        */

        window.addEventListener(
            "blur",
            stopMoving
        );


        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.hidden
                ) {

                    stopMoving();
                }
            }
        );


        /*
           RESIZE
        */

        window.addEventListener(
            "resize",
            resize
        );


        /*
           INITIALIZE
        */

        bestEl.textContent =
            "BEST " +
            String(best).padStart(
                5,
                "0"
            );


        resize();

        reset(true);

        draw();
    }


    /* 
       DOM READY
     */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initDinoGame,
            {
                once: true
            }
        );

    } else {

        initDinoGame();
    }

})();
