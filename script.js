

document.addEventListener("DOMContentLoaded", () => {

    const intro =
        document.getElementById("intro");

    const website =
        document.getElementById("website");

    const startButton =
        document.getElementById("startButton");

    const music =
        document.getElementById("backgroundMusic");

    const musicButton =
        document.getElementById("musicButton");

    const musicText =
        document.getElementById("musicText");

    const floatingHearts =
        document.getElementById("floatingHearts");

    const scrollProgress =
        document.getElementById("scrollProgress");

    const sleep = ms =>
        new Promise(resolve =>
            setTimeout(resolve, ms)
        );

    const clamp = (
        value,
        min,
        max
    ) =>
        Math.min(
            Math.max(value, min),
            max
        );

    let musicPlaying = false;

    function updateMusicUI() {

        if (musicText) {

            musicText.textContent =
                musicPlaying
                    ? "ON"
                    : "Music";

        }

    }

    async function playMusic() {

        if (!music) return;

        music.volume = .35;

        try {

            await music.play();

            musicPlaying = true;

        } catch (error) {

            musicPlaying = false;

        }

        updateMusicUI();

    }

    function pauseMusic() {

        if (!music) return;

        music.pause();

        musicPlaying = false;

        updateMusicUI();

    }

    if (musicButton) {

        musicButton.addEventListener(
            "click",
            () => {

                if (!music) return;

                if (music.paused) {

                    playMusic();

                } else {

                    pauseMusic();

                }

            }
        );

    }

    if (music) {

        music.addEventListener(
            "play",
            () => {

                musicPlaying = true;

                updateMusicUI();

            }
        );

        music.addEventListener(
            "pause",
            () => {

                musicPlaying = false;

                updateMusicUI();

            }
        );

    }

    function normalizeMeetingAnswer(value) {
        return String(value || "")
            .trim()
            .toLowerCase()
            .replace(/,/g, "")
            .replace(/\s+/g, " ");
    }

    function showBirthdayGate() {
        if (document.getElementById("birthdayGate")) return;

        const gate = document.createElement("div");
        gate.id = "birthdayGate";
        gate.className = "birthday-gate";
        gate.innerHTML = `
            <div class="birthday-gate-door birthday-gate-door-left" aria-hidden="true"></div>
            <div class="birthday-gate-door birthday-gate-door-right" aria-hidden="true"></div>
            <div class="birthday-gate-card">
                <div class="birthday-gate-kicker">♡ Sebelum masuk ♡</div>
                <h2>Setelah Berpisah, Kapan pertama kali kita bertemu kembali ?</h2>
                <p class="birthday-gate-subtitle"></p>
                <input
                    id="birthdayGateInput"
                    class="birthday-gate-input"
                    type="text"
                    autocomplete="off"
                    
                >
                <button id="birthdayGateSubmit" class="birthday-gate-submit" type="button">
                    Masuk ♡
                </button>
                <div id="birthdayGateFeedback" class="birthday-gate-feedback" aria-live="polite"></div>
            </div>
        `;

        document.body.appendChild(gate);

        const input = gate.querySelector("#birthdayGateInput");
        const submit = gate.querySelector("#birthdayGateSubmit");
        const feedback = gate.querySelector("#birthdayGateFeedback");

        const correctAnswers = new Set([
            "27 maret 2026",
            "27/03/2026",
            "27-03-2026",
            "27.03.2026",
            "2026-03-27"
        ]);

        const checkAnswer = async () => {
            const answer = normalizeMeetingAnswer(input.value);
            const isCorrect = correctAnswers.has(answer);

            if (!isCorrect) {
                gate.classList.remove("success", "wrong");
                void gate.offsetWidth;
                gate.classList.add("wrong");
                feedback.textContent = "kamu bukan Dini Septiani. Dilarang masuk";
                return;
            }

            gate.classList.remove("wrong");
            gate.classList.add("success");
            feedback.textContent = "betul sekali kamu adalah Dini Septiani, silahkan Tuan putri";
            input.disabled = true;
            submit.disabled = true;

            createHeartExplosion(18);

            await sleep(1900);

            gate.classList.add("closing");
            await sleep(900);
            gate.classList.add("hide");

            await sleep(700);
            gate.remove();

            if (intro) {
                intro.classList.add("hidden");
            }

            if (website) {
                website.classList.remove("hidden");
                website.classList.add("is-visible");
            }

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

            openCandleScene();
            startCandleMicrophone();

            if (music) {
                try {
                    music.muted = true;
                    await music.play();
                    music.pause();
                    music.currentTime = 0;
                    music.muted = false;
                } catch (error) {
                    music.muted = false;
                }
            }
        };

        submit.addEventListener("click", checkAnswer);
        input.addEventListener("keydown", event => {
            if (event.key === "Enter") checkAnswer();
        });

        requestAnimationFrame(() => {
            gate.classList.add("show");
            requestAnimationFrame(() => {
                gate.classList.add("open");
                input.focus();
            });
        });
    }

    if (startButton) {
        startButton.addEventListener("click", () => {
            showBirthdayGate();
        });
    }

    function createFloatingHeart() {

        if (!floatingHearts) return;

        if (
            website &&
            website.classList.contains("hidden")
        ) {
            return;
        }

        const heart =
            document.createElement("div");

        heart.className =
            "floating-heart";

        heart.textContent =
            Math.random() > .5
                ? "♡"
                : "♥";

        heart.style.left =
            Math.random() * 100 + "%";

        heart.style.fontSize =
            10 +
            Math.random() * 18 +
            "px";

        heart.style.animationDuration =
            5 +
            Math.random() * 5 +
            "s";

        floatingHearts.appendChild(
            heart
        );

        setTimeout(
            () => heart.remove(),
            11000
        );

    }

    setInterval(
        createFloatingHeart,
        1600
    );

    function createHeartExplosion(
        amount = 20
    ) {

        if (!floatingHearts) return;

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            setTimeout(
                () => {

                    const heart =
                        document.createElement(
                            "div"
                        );

                    heart.className =
                        "floating-heart";

                    heart.textContent =
                        Math.random() > .35
                            ? "♥"
                            : "♡";

                    heart.style.left =
                        35 +
                        Math.random() * 30 +
                        "%";

                    heart.style.bottom =
                        15 +
                        Math.random() * 25 +
                        "%";

                    heart.style.fontSize =
                        15 +
                        Math.random() * 30 +
                        "px";

                    heart.style.animationDuration =
                        3 +
                        Math.random() * 3 +
                        "s";

                    floatingHearts.appendChild(
                        heart
                    );

                    setTimeout(
                        () => heart.remove(),
                        7000
                    );

                },
                i * 55
            );

        }

    }

    const zipperEnvelope =
        document.getElementById(
            "zipperEnvelope"
        );

    const zipperHandle =
        document.getElementById(
            "zipperHandle"
        );

    const diary =
        document.getElementById(
            "diary"
        );

    let zipperDragging = false;

    let zipperOpened = false;

    let zipperOffsetY = 0;

    let zipperPointerId = null;
    let zipperStartX = 0;
    let zipperStartY = 0;
    const ZIPPER_DRAG_THRESHOLD = 10;

    function getOriginalBounds() {

        if (
            !zipperEnvelope ||
            !zipperHandle
        ) {

            return {
                min: 8,
                max: 8
            };

        }

        const height =
            zipperEnvelope.clientHeight;

        const handleHeight =
            zipperHandle.offsetHeight;

        const min = 8;

        const max =
            Math.max(
                min,
                height -
                handleHeight -
                8
            );

        return {
            min,
            max
        };

    }

    function setOriginalPosition(
        top,
        animate = false
    ) {

        if (!zipperHandle) return;

        const bounds =
            getOriginalBounds();

        const safeTop =
            clamp(
                top,
                bounds.min,
                bounds.max
            );

        zipperHandle.style.transition =
            animate
                ? "top .55s cubic-bezier(.2,.8,.2,1)"
                : "none";

        zipperHandle.style.top =
            safeTop + "px";

        if (zipperEnvelope) {

            const range =
                bounds.max -
                bounds.min;

            const progress =
                range <= 0
                    ? 0
                    : (
                        safeTop -
                        bounds.min
                    ) / range;

            zipperEnvelope.style.setProperty(
                "--zipper-progress",
                progress
            );

        }

    }

    function openOriginalLetter() {

        if (zipperOpened) return;

        zipperOpened = true;

        const bounds =
            getOriginalBounds();

        setOriginalPosition(
            bounds.max,
            true
        );

        if (zipperEnvelope) {

            zipperEnvelope.classList.add(
                "opened"
            );

        }

        createHeartExplosion(30);

        setTimeout(
            () => {

                if (!diary) return;

                diary.classList.remove(
                    "hidden"
                );

                diary.classList.add(
                    "show"
                );

                setTimeout(
                    () => {

                        diary.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    },
                    500
                );

            },
            700
        );

    }

    if (
        zipperHandle &&
        zipperEnvelope
    ) {

        zipperHandle.addEventListener(
            "pointerdown",
            event => {

                if (zipperOpened) return;

                zipperPointerId = event.pointerId;
                zipperStartX = event.clientX;
                zipperStartY = event.clientY;

                const rect =
                    zipperEnvelope.getBoundingClientRect();

                zipperOffsetY =
                    event.clientY -
                    rect.top -
                    zipperHandle.offsetTop;

                zipperDragging = false;

            }
        );

        zipperHandle.addEventListener(
            "pointermove",
            event => {

                if (
                    zipperPointerId !== event.pointerId ||
                    zipperOpened
                ) {
                    return;
                }

                const deltaX =
                    event.clientX - zipperStartX;

                const deltaY =
                    event.clientY - zipperStartY;

                const absX = Math.abs(deltaX);
                const absY = Math.abs(deltaY);

                if (!zipperDragging) {

                    if (
                        absX < ZIPPER_DRAG_THRESHOLD &&
                        absY < ZIPPER_DRAG_THRESHOLD
                    ) {
                        return;
                    }

                    if (absX > absY) {
                        zipperPointerId = null;
                        return;
                    }

                    zipperDragging = true;
                    zipperHandle.classList.add("dragging");
                    zipperHandle.style.transition = "none";

                    try {
                        zipperHandle.setPointerCapture(
                            event.pointerId
                        );
                    } catch (error) {}
                }

                event.preventDefault();

                const rect =
                    zipperEnvelope.getBoundingClientRect();

                const newTop =
                    event.clientY -
                    rect.top -
                    zipperOffsetY;

                setOriginalPosition(
                    newTop,
                    false
                );
            }
        );

        zipperHandle.addEventListener(
            "pointerup",
            event => {

                if (
                    zipperPointerId !== event.pointerId
                ) {
                    return;
                }

                zipperPointerId = null;

                if (!zipperDragging) {
                    return;
                }

                zipperDragging = false;
                zipperHandle.classList.remove("dragging");

                const bounds =
                    getOriginalBounds();

                const current =
                    zipperHandle.offsetTop;

                const range =
                    bounds.max -
                    bounds.min;

                const progress =
                    range <= 0
                        ? 0
                        : (
                            current -
                            bounds.min
                        ) / range;

                if (progress >= .65) {

                    openOriginalLetter();

                } else {

                    setOriginalPosition(
                        bounds.min,
                        true
                    );

                }

                try {
                    zipperHandle.releasePointerCapture(
                        event.pointerId
                    );
                } catch (error) {}
            }
        );

        zipperHandle.addEventListener(
            "pointercancel",
            event => {

                if (
                    zipperPointerId !== event.pointerId
                ) {
                    return;
                }

                zipperPointerId = null;
                zipperDragging = false;
                zipperHandle.classList.remove("dragging");

                if (!zipperOpened) {
                    setOriginalPosition(
                        getOriginalBounds().min,
                        true
                    );
                }

                try {
                    zipperHandle.releasePointerCapture(
                        event.pointerId
                    );
                } catch (error) {}
            }
        );

    }

    const secretButton =
        document.getElementById(
            "secretButton"
        );

    const secretMessage =
        document.getElementById(
            "secretMessage"
        );

    if (
        secretButton &&
        secretMessage
    ) {

        secretButton.addEventListener(
            "click",
            () => {

                secretMessage.classList.remove(
                    "hidden"
                );

                secretMessage.classList.add(
                    "show"
                );

                secretButton.style.display =
                    "none";

                createHeartExplosion(35);

            }
        );

    }

    const giftLetterStage =
        document.getElementById(
            "giftLetterStage"
        );

    const clueEnvelope =
        document.getElementById(
            "clueEnvelope"
        );

    const clueZipper =
        document.querySelector(
            ".clue-zipper"
        );

    const clueZipperPull =
        document.getElementById(
            "clueZipperPull"
        );

    const clueOpenMessage =
        document.getElementById(
            "clueOpenMessage"
        );

    const readyGiftButton =
        document.getElementById(
            "readyGiftButton"
        );

    const giftGamePanel =
        document.getElementById(
            "giftGamePanel"
        );

    const gameGiftButtons =
        Array.from(
            document.querySelectorAll(
                ".game-gift"
            )
        );

    const giftRound =
        document.getElementById(
            "giftRound"
        );

    const giftStatus =
        document.getElementById(
            "giftStatus"
        );

    const giftGameTitle =
        document.getElementById(
            "giftGameTitle"
        );

    const giftGameText =
        document.getElementById(
            "giftGameText"
        );

    const giftCountdown =
        document.getElementById(
            "giftCountdown"
        );

    const countdownNumber =
        document.getElementById(
            "countdownNumber"
        );

    const giftGameMessage =
        document.getElementById(
            "giftGameMessage"
        );

    const giftResultHeart =
        document.getElementById(
            "giftResultHeart"
        );

    const giftResultTitle =
        document.getElementById(
            "giftResultTitle"
        );

    const giftResultText =
        document.getElementById(
            "giftResultText"
        );

    const giftRetry =
        document.getElementById(
            "giftRetry"
        );

    const hiddenGiftLetter =
        document.getElementById(
            "hiddenGiftLetter"
        );

    let romanticPetalsPlayed = false;
    let birthdayEndingShown = false;
    let finalHeartTaps = 0;
    let finalHeartTapTimer = null;

    function createRomanticPetals(amount = 34) {

        const oldLayer =
            document.querySelector(".romantic-petals");

        if (oldLayer) oldLayer.remove();

        const layer =
            document.createElement("div");

        layer.className = "romantic-petals";

        const symbols = ["♡", "♥", "✿", "❀"];

        for (let i = 0; i < amount; i++) {

            const petal =
                document.createElement("span");

            petal.className =
                "romantic-petal";

            petal.textContent =
                symbols[
                    Math.floor(
                        Math.random() * symbols.length
                    )
                ];

            petal.style.left =
                Math.random() * 100 + "%";

            petal.style.fontSize =
                12 + Math.random() * 16 + "px";

            petal.style.animationDelay =
                Math.random() * 1.8 + "s";

            petal.style.setProperty(
                "--petal-drift",
                Math.random() * 160 - 80 + "px"
            );

            layer.appendChild(petal);
        }

        document.body.appendChild(layer);

        setTimeout(
            () => layer.remove(),
            7600
        );
    }

    function prepareBirthdayEnding() {

        if (birthdayEndingShown) return;

        const overlay =
            document.createElement("div");

        overlay.className =
            "birthday-ending-overlay";

        overlay.innerHTML = `
            <div class="birthday-ending-content">
                <div class="birthday-ending-small">Untuk</div>
                <div class="birthday-ending-name">Dini Septiani</div>
                <div class="birthday-ending-date">13 · 09</div>
                <div class="birthday-ending-age">25</div>
                <div class="birthday-ending-message">
                    Selamat ulang tahun Perempuanku.<br>
                    Dibuat dengan hati dan penuh cinta ♡ Mohon maaf jika sederhana.
                </div>
                <button class="birthday-ending-close" type="button">
                    ♡
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        const close =
            overlay.querySelector(
                ".birthday-ending-close"
            );

        if (close) {
            close.addEventListener(
                "click",
                () => {
                    overlay.classList.remove("show");

                    setTimeout(
                        () => overlay.remove(),
                        1000
                    );
                }
            );
        }

        birthdayEndingShown = true;

        requestAnimationFrame(
            () => overlay.classList.add("show")
        );

        createHeartExplosion(25);
    }

    function activateFinalHeartEasterEgg() {

        const finalHeart =
            document.getElementById("finalHeart");

        const secret =
            document.getElementById(
                "birthday25Secret"
            );

        if (!finalHeart || !secret) return;

        finalHeart.addEventListener(
            "click",
            () => {

                finalHeartTaps++;

                clearTimeout(finalHeartTapTimer);

                finalHeartTapTimer =
                    setTimeout(
                        () => {
                            finalHeartTaps = 0;
                        },
                        1600
                    );

                if (finalHeartTaps >= 5) {

                    finalHeartTaps = 0;

                    secret.classList.add("show");

                    createHeartExplosion(25);
                }
            }
        );
    }

    activateFinalHeartEasterEgg();

    const finalSection =
        document.querySelector(".final-section");

    if (finalSection) {

        const endingObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting &&
                                entry.intersectionRatio >= .55
                            ) {
                                prepareBirthdayEnding();
                                endingObserver.disconnect();
                            }

                        }
                    );
                },
                { threshold: [.55] }
            );

        endingObserver.observe(finalSection);
    }

    let clueOpened = false;

    let giftGameStarted = false;

    let gameLocked = true;

    let gameFinished = false;

    let winningBoxId = null;

    let currentRound = 1;

    let gameToken = 0;

    let clueDragging = false;

    let clueOffsetX = 0;

    let cluePointerId = null;
    let clueStartX = 0;
    let clueStartY = 0;
    const CLUE_DRAG_THRESHOLD = 10;

    function getClueBounds() {

        if (
            !clueZipper ||
            !clueZipperPull
        ) {

            return {
                min: 0,
                max: 0
            };

        }

        const trackWidth =
            clueZipper.clientWidth;

        const handleWidth =
            clueZipperPull.offsetWidth;

        const padding = 0;

        const min =
            padding;

        const max =
            Math.max(
                min,
                trackWidth -
                handleWidth -
                padding
            );

        return {
            min,
            max
        };

    }

    function setCluePosition(
        x,
        animate = false
    ) {

        if (
            !clueZipper ||
            !clueZipperPull
        ) {
            return;
        }

        const bounds =
            getClueBounds();

        const safeX =
            clamp(
                x,
                bounds.min,
                bounds.max
            );

        clueZipperPull.style.transition =
            animate
                ? "left .6s cubic-bezier(.2,.8,.2,1)"
                : "none";

        clueZipperPull.style.left =
            safeX + "px";

        const range =
            bounds.max -
            bounds.min;

        const progress =
            range <= 0
                ? 0
                : (
                    safeX -
                    bounds.min
                ) / range;

        clueZipper.style.setProperty(
            "--zip-progress",
            progress
        );

    }

    function resetClueZipper() {

        const bounds =
            getClueBounds();

        setCluePosition(
            bounds.min,
            false
        );

    }

    function openClueLetter() {

        if (clueOpened) return;

        clueOpened = true;

        clueDragging = false;

        const bounds =
            getClueBounds();

        setCluePosition(
            bounds.max,
            true
        );

        if (clueEnvelope) {

            clueEnvelope.classList.add(
                "opened"
            );

        }

        createHeartExplosion(25);

        setTimeout(
            () => {

                if (!clueOpenMessage) {
                    return;
                }

                clueOpenMessage.classList.add(
                    "show"
                );

            },
            650
        );

    }

    if (
        clueZipperPull &&
        clueZipper
    ) {

        clueZipperPull.addEventListener(
            "pointerdown",
            event => {

                if (clueOpened) return;

                cluePointerId = event.pointerId;
                clueStartX = event.clientX;
                clueStartY = event.clientY;

                const rect =
                    clueZipper.getBoundingClientRect();

                clueOffsetX =
                    event.clientX -
                    rect.left -
                    clueZipperPull.offsetLeft;

                clueDragging = false;

            }
        );

        clueZipperPull.addEventListener(
            "pointermove",
            event => {

                if (
                    cluePointerId !== event.pointerId ||
                    clueOpened
                ) {
                    return;
                }

                const deltaX =
                    event.clientX - clueStartX;

                const deltaY =
                    event.clientY - clueStartY;

                const absX = Math.abs(deltaX);
                const absY = Math.abs(deltaY);

                if (!clueDragging) {

                    if (
                        absX < CLUE_DRAG_THRESHOLD &&
                        absY < CLUE_DRAG_THRESHOLD
                    ) {
                        return;
                    }

                    if (absY > absX) {
                        cluePointerId = null;
                        return;
                    }

                    clueDragging = true;

                    clueZipperPull.classList.add(
                        "dragging"
                    );

                    clueZipperPull.style.transition =
                        "none";

                    try {
                        clueZipperPull.setPointerCapture(
                            event.pointerId
                        );
                    } catch (error) {}
                }

                event.preventDefault();

                const rect =
                    clueZipper.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left -
                    clueOffsetX;

                setCluePosition(
                    x,
                    false
                );

                const bounds =
                    getClueBounds();

                const range =
                    bounds.max -
                    bounds.min;

                const progress =
                    range <= 0
                        ? 0
                        : (
                            clueZipperPull.offsetLeft -
                            bounds.min
                        ) / range;

                if (progress >= .70) {
                    openClueLetter();
                }
            }
        );

        clueZipperPull.addEventListener(
            "pointerup",
            event => {

                if (
                    cluePointerId !== event.pointerId
                ) {
                    return;
                }

                cluePointerId = null;

                if (!clueDragging) {
                    return;
                }

                clueDragging = false;

                clueZipperPull.classList.remove(
                    "dragging"
                );

                const bounds =
                    getClueBounds();

                const range =
                    bounds.max -
                    bounds.min;

                const progress =
                    range <= 0
                        ? 0
                        : (
                            clueZipperPull.offsetLeft -
                            bounds.min
                        ) / range;

                if (progress >= .55) {

                    openClueLetter();

                } else {

                    setCluePosition(
                        bounds.min,
                        true
                    );

                }

                try {
                    clueZipperPull.releasePointerCapture(
                        event.pointerId
                    );
                } catch (error) {}
            }
        );

        clueZipperPull.addEventListener(
            "pointercancel",
            event => {

                if (
                    cluePointerId !== event.pointerId
                ) {
                    return;
                }

                cluePointerId = null;
                clueDragging = false;

                clueZipperPull.classList.remove(
                    "dragging"
                );

                if (!clueOpened) {
                    resetClueZipper();
                }

                try {
                    clueZipperPull.releasePointerCapture(
                        event.pointerId
                    );
                } catch (error) {}
            }
        );

    }

    const boxSlots =
        new Map();

    gameGiftButtons.forEach(
        (box, index) => {

            boxSlots.set(
                box.dataset.box,
                index
            );

        }
    );

    const SLOT_PERCENTAGES = [
        10,
        30,
        50,
        70,
        90
    ];

    function getGiftStage() {

        return document.getElementById(
            "giftBoxStage"
        );

    }

    function getSlotX(slot) {

        const stage =
            getGiftStage();

        if (!stage) {

            return 0;

        }

        return (
            stage.clientWidth *
            (
                SLOT_PERCENTAGES[slot] /
                100
            )
        );

    }

    function getGiftScale() {

        const stage =
            getGiftStage();

        if (!stage) return 1;

        return clamp(
            stage.clientWidth / 850,
            .55,
            1
        );

    }

    function setBoxPosition(
        box,
        slot,
        instant = false
    ) {

        if (!box) return;

        const x =
            getSlotX(slot);

        box.style.left =
            x + "px";

        box.style.top =
            "50%";

        box.style.setProperty(
            "--gift-scale",
            getGiftScale()
        );

        if (instant) {

            box.style.transition =
                "none";

            requestAnimationFrame(
                () => {

                    box.style.transition =
                        "";

                }
            );

        }

        boxSlots.set(
            box.dataset.box,
            slot
        );

    }

    function resetAllGiftPositions() {

        gameGiftButtons.forEach(
            (box, index) => {

                setBoxPosition(
                    box,
                    index,
                    true
                );

            }
        );

    }

    function getBoxBySlot(slot) {

        return gameGiftButtons.find(
            box =>
                boxSlots.get(
                    box.dataset.box
                ) === slot
        );

    }

    function lockAllGiftBoxes() {

        gameGiftButtons.forEach(
            box => {

                box.classList.add(
                    "locked"
                );

                box.disabled = true;

            }
        );

    }

    function unlockGiftBoxes() {

        gameGiftButtons.forEach(
            box => {

                box.classList.remove(
                    "locked"
                );

                box.disabled = false;

            }
        );

    }

    function updateGiftStatus(
        text
    ) {

        if (giftStatus) {

            giftStatus.textContent =
                text;

        }

    }

    if (readyGiftButton) {

        readyGiftButton.addEventListener(
            "click",
            () => {

                if (
                    !clueOpened ||
                    giftGameStarted
                ) {
                    return;
                }

                giftGameStarted = true;

                if (giftLetterStage) {

                    giftLetterStage.classList.add(
                        "hidden"
                    );

                }

                if (giftGamePanel) {

                    giftGamePanel.classList.remove(
                        "hidden"
                    );

                    giftGamePanel.classList.add(
                        "show"
                    );

                }

                prepareGiftGame();

            }
        );

    }

    function prepareGiftGame() {

        gameToken++;

        const token =
            gameToken;

        gameFinished = false;

        gameLocked = true;

        if (giftRound) {

            giftRound.textContent =
                "ROUND " +
                currentRound;

        }

        if (giftGameTitle) {

            giftGameTitle.textContent =
                "Perhatikan baik-baik.";

        }

        if (giftGameText) {

            giftGameText.textContent =
                "Satu kotak akan dibuka. Lihat baik-baik suratnya masuk ke mana.";

        }

        updateGiftStatus(
            "PERHATIKAN"
        );

        if (giftGameMessage) {

            giftGameMessage.classList.add(
                "hidden"
            );

            giftGameMessage.classList.remove(
                "show"
            );

        }

        if (giftRetry) {

            giftRetry.classList.add(
                "hidden"
            );

        }

        if (hiddenGiftLetter) {

            hiddenGiftLetter.classList.add(
                "hidden"
            );

            hiddenGiftLetter.classList.remove(
                "show",
                "cinematic-letter"
            );

        }

        resetAllGiftPositions();

        gameGiftButtons.forEach(
            box => {

                box.className =
                    "game-gift locked";

                box.disabled = true;

                const letter =
                    box.querySelector(
                        ".gift-secret-letter"
                    );

                if (letter) {

                    letter.classList.remove(
                        "show-secret",
                        "inserting",
                        "secret-inside"
                    );

                }

            }
        );

        const randomIndex =
            Math.floor(
                Math.random() *
                gameGiftButtons.length
            );

        const winner =
            gameGiftButtons[randomIndex];

        winningBoxId =
            winner
                ? winner.dataset.box
                : null;

        setTimeout(
            () => {

                if (
                    token !== gameToken
                ) {
                    return;
                }

                revealWinningBox(
                    token
                );

            },
            800
        );

    }

    function getWinningBox() {

        return gameGiftButtons.find(
            box =>
                box.dataset.box ===
                winningBoxId
        );

    }

    async function revealWinningBox(
        token
    ) {

        const winner =
            getWinningBox();

        if (
            !winner ||
            token !== gameToken
        ) {
            return;
        }

        updateGiftStatus(
            "LIHAT BAIK-BAIK"
        );

        if (giftGameTitle) {

            giftGameTitle.textContent =
                "Ingat kotak ini.";

        }

        winner.classList.add(
            "opening",
            "winner-glow"
        );

        await sleep(600);

        if (token !== gameToken) return;

        const letter =
            winner.querySelector(
                ".gift-secret-letter"
            );

        if (!letter) {

            await startGiftShuffle(
                token
            );

            return;

        }

        letter.classList.add(
            "show-secret"
        );

        if (giftGameTitle) {

            giftGameTitle.textContent =
                "Ini petunjukmu.";

        }

        if (giftGameText) {

            giftGameText.textContent =
                "Lihat baik-baik... surat ini akan masuk ke dalam kotak.";

        }

        await sleep(1100);

        if (token !== gameToken) return;

        letter.classList.remove(
            "show-secret"
        );

        letter.classList.add(
            "inserting"
        );

        await sleep(800);

        if (token !== gameToken) return;

        letter.classList.remove(
            "inserting"
        );

        letter.classList.add(
            "secret-inside"
        );

        await sleep(450);

        winner.classList.remove(
            "opening"
        );

        winner.classList.add(
            "open"
        );

        await sleep(650);

        winner.classList.remove(
            "open"
        );

        await sleep(400);

        await startGiftShuffle(
            token
        );

    }

    async function startGiftShuffle(
        token
    ) {

        if (
            token !== gameToken
        ) {
            return;
        }

        gameLocked = true;

        lockAllGiftBoxes();

        updateGiftStatus(
            "BERSIAP..."
        );

        if (giftGameTitle) {

            giftGameTitle.textContent =
                "Ingat baik-baik...";

        }

        if (giftGameText) {

            giftGameText.textContent =
                "Sekarang kotak-kotaknya akan diacak.";

        }

        await countdown(
            3,
            token
        );

        if (token !== gameToken) {
            return;
        }

        updateGiftStatus(
            "SHUFFLING..."
        );

        await performShuffle(
            token
        );

        if (token !== gameToken) {
            return;
        }

        gameLocked = false;

        unlockGiftBoxes();

        updateGiftStatus(
            "PILIH SATU"
        );

        if (giftGameTitle) {

            giftGameTitle.textContent =
                "Sekarang pilih satu.";

        }

        if (giftGameText) {

            giftGameText.textContent =
                "Ikuti kotak yang tadi menyimpan surat. 👀";

        }

    }

    async function countdown(
        number,
        token
    ) {

        for (
            let i = number;
            i > 0;
            i--
        ) {

            if (
                token !== gameToken
            ) {
                return;
            }

            if (giftCountdown) {

                giftCountdown.classList.remove(
                    "hidden"
                );

            }

            if (countdownNumber) {

                countdownNumber.textContent =
                    i;

                countdownNumber.style.animation =
                    "none";

                void countdownNumber.offsetWidth;

                countdownNumber.style.animation =
                    "giftCountdownPop .7s ease forwards";

            }

            await sleep(800);

        }

        if (giftCountdown) {

            giftCountdown.classList.add(
                "hidden"
            );

        }

    }

    async function swapSlots(
        slotA,
        slotB,
        token
    ) {

        if (
            token !== gameToken
        ) {
            return;
        }

        const boxA =
            getBoxBySlot(slotA);

        const boxB =
            getBoxBySlot(slotB);

        if (
            !boxA ||
            !boxB
        ) {
            return;
        }

        setBoxPosition(
            boxA,
            slotB
        );

        setBoxPosition(
            boxB,
            slotA
        );

        await sleep(550);

    }

    async function performShuffle(
        token
    ) {

        const swaps = [

            [0, 4],
            [1, 3],
            [0, 2],
            [2, 4],
            [0, 3],
            [1, 4],
            [0, 2],
            [1, 3],
            [2, 4],
            [0, 3]

        ];

        for (
            const [a, b]
            of swaps
        ) {

            if (
                token !== gameToken
            ) {
                return;
            }

            await swapSlots(
                a,
                b,
                token
            );

            await sleep(100);

        }

    }

    gameGiftButtons.forEach(
        box => {

            box.addEventListener(
                "click",
                () => {

                    if (
                        gameLocked ||
                        gameFinished
                    ) {
                        return;
                    }

                    handleGiftChoice(
                        box
                    );

                }
            );

        }
    );

    async function handleGiftChoice(
        selectedBox
    ) {

        if (
            gameLocked ||
            gameFinished
        ) {
            return;
        }

        gameLocked = true;

        lockAllGiftBoxes();

        const correct =
            selectedBox.dataset.box ===
            winningBoxId;

        if (correct) {

            await correctChoice(
                selectedBox
            );

        } else {

            await wrongChoice(
                selectedBox
            );

        }

    }

    async function correctChoice(
        box
    ) {

        gameFinished = true;

        updateGiftStatus(
            "BENAR! ♥"
        );

        if (giftGameTitle) {

            giftGameTitle.textContent =
                "Kamu menemukannya! 🎉";

        }

        if (giftGameText) {

            giftGameText.textContent =
                "Kotak yang kamu ikuti ternyata benar.";

        }

        box.classList.add(
            "winner-glow",
            "opening"
        );

        createHeartExplosion(50);

        await sleep(650);

        box.classList.add(
            "open"
        );

        const letter =
            box.querySelector(
                ".gift-secret-letter"
            );

        if (letter) {

            letter.classList.remove(
                "secret-inside",
                "inserting"
            );

            letter.classList.add(
                "show-secret"
            );

        }

        await sleep(800);

        if (giftGameMessage) {

            giftGameMessage.classList.remove(
                "hidden"
            );

            giftGameMessage.classList.add(
                "show"
            );

        }

        if (giftResultHeart) {

            giftResultHeart.textContent =
                "♡";

        }

        if (giftResultTitle) {

            giftResultTitle.textContent =
                "Surat rahasianya berhasil ditemukan.";

        }

        if (giftResultText) {

            giftResultText.textContent =
                "Dibaca yaa sayaang ♡";

        }

        await sleep(900);

        if (!hiddenGiftLetter) {
            return;
        }

        const giftSection =
            document.getElementById("giftGame");

        if (giftSection) {
            giftSection.classList.add(
                "letter-reveal-active"
            );
        }

        if (giftResultHeart) {
            giftResultHeart.classList.add(
                "heartbeat"
            );
        }

        await sleep(450);

        hiddenGiftLetter.classList.remove(
            "hidden"
        );

        hiddenGiftLetter.classList.add(
            "show",
            "cinematic-letter"
        );

        giftGameMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        if (!romanticPetalsPlayed) {
            romanticPetalsPlayed = true;

            setTimeout(
                () => createRomanticPetals(36),
                850
            );
        }
    }

    async function wrongChoice(
        box
    ) {

        updateGiftStatus(
            "BELUM TEPAT"
        );

        if (giftGameTitle) {

            giftGameTitle.textContent =
                "Yah... bukan yang ini 😝";

        }

        if (giftGameText) {

            giftGameText.textContent =
                "Kotaknya kosong. Suratnya masih bersembunyi.";

        }

        box.classList.add(
            "wrong"
        );

        box.animate(
            [
                {
                    transform:
                        "translate(-50%, -50%) scale(var(--gift-scale, 1)) rotate(0deg)"
                },
                {
                    transform:
                        "translate(-50%, -50%) scale(var(--gift-scale, 1)) rotate(-5deg)"
                },
                {
                    transform:
                        "translate(-50%, -50%) scale(var(--gift-scale, 1)) rotate(5deg)"
                },
                {
                    transform:
                        "translate(-50%, -50%) scale(var(--gift-scale, 1)) rotate(0deg)"
                }
            ],
            {
                duration: 500,
                easing: "ease-in-out"
            }
        );

        await sleep(600);

        box.classList.remove(
            "wrong"
        );

        if (giftGameMessage) {

            giftGameMessage.classList.remove(
                "hidden"
            );

            giftGameMessage.classList.add(
                "show"
            );

        }

        if (giftResultTitle) {

            giftResultTitle.textContent =
                "Belum tepat.";

        }

        if (giftResultText) {

            giftResultText.textContent =
                "Coba ingat lagi gerakan kotaknya. Kamu masih punya kesempatan.";

        }

        if (giftRetry) {

            giftRetry.classList.remove(
                "hidden"
            );

        }

    }

    if (giftRetry) {

        giftRetry.addEventListener(
            "click",
            () => {

                if (gameFinished) {
                    return;
                }

                gameToken++;

                currentRound++;

                if (giftRound) {

                    giftRound.textContent =
                        "ROUND " +
                        currentRound;

                }

                gameLocked = true;

                if (giftGameMessage) {

                    giftGameMessage.classList.add(
                        "hidden"
                    );

                    giftGameMessage.classList.remove(
                        "show"
                    );

                }

                giftRetry.classList.add(
                    "hidden"
                );

                resetAllGiftPositions();

                prepareGiftGame();

            }
        );

    }

    function updateScrollProgress() {

        if (!scrollProgress) return;

        const max =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const percentage =
            max <= 0
                ? 0
                : (
                    window.scrollY /
                    max
                ) * 100;

        scrollProgress.style.width =
            clamp(
                percentage,
                0,
                100
            ) + "%";

    }

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        () => {

            updateScrollProgress();

            if (!zipperOpened) {

                setOriginalPosition(
                    8,
                    false
                );

            }

            if (!clueOpened) {

                resetClueZipper();

            }

            resetAllGiftPositions();

        }
    );

    updateScrollProgress();

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );

    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "show"
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: .12
                }
            );

        revealElements.forEach(
            element =>
                observer.observe(element)
        );

    } else {

        revealElements.forEach(
            element =>
                element.classList.add(
                    "show"
                )
        );

    }

    document.addEventListener(
        "dblclick",
        event => {

            if (!floatingHearts) return;

            for (
                let i = 0;
                i < 8;
                i++
            ) {

                const heart =
                    document.createElement(
                        "div"
                    );

                heart.className =
                    "floating-heart";

                heart.textContent =
                    "♥";

                heart.style.left =
                    event.clientX + "px";

                heart.style.top =
                    event.clientY + "px";

                heart.style.bottom =
                    "auto";

                heart.style.fontSize =
                    12 +
                    Math.random() * 20 +
                    "px";

                heart.style.animationDuration =
                    2 +
                    Math.random() * 2 +
                    "s";

                floatingHearts.appendChild(
                    heart
                );

                setTimeout(
                    () => heart.remove(),
                    5000
                );

            }

        }
    );

    let candleScene = null;
    let candleStream = null;
    let candleAudioContext = null;
    let candleAnalyser = null;
    let candleAnimationFrame = null;
    let candleDetecting = false;
    let candleBlown = false;

    function addCandleStyles() {

        if (document.getElementById("candle-inline-styles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "candle-inline-styles";

        style.textContent = `
            body.candle-active { overflow: hidden !important; }

            #candleScene {
                position: fixed;
                inset: 0;
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                background:
                    radial-gradient(circle at 50% 34%, rgba(255,115,160,.18), transparent 27%),
                    radial-gradient(circle at 50% 78%, rgba(255,170,205,.10), transparent 38%),
                    linear-gradient(180deg, #050405 0%, #0b070a 48%, #160b11 100%);
                opacity: 1;
                visibility: visible;
                transition: opacity 1s ease, visibility 1s ease;
            }

            #candleScene::before {
                content: "";
                position: absolute;
                width: 75vw;
                height: 32vh;
                left: 12.5vw;
                bottom: -13vh;
                border-radius: 50%;
                background: rgba(255,106,157,.14);
                filter: blur(55px);
                pointer-events: none;
            }

            #candleScene::after {
                content: "";
                position: absolute;
                inset: 0;
                pointer-events: none;
                background:
                    radial-gradient(circle at 12% 18%, rgba(255,255,255,.08) 0 1px, transparent 2px),
                    radial-gradient(circle at 83% 27%, rgba(255,190,215,.08) 0 1px, transparent 2px),
                    radial-gradient(circle at 73% 73%, rgba(255,255,255,.06) 0 1px, transparent 2px);
                background-size: 180px 170px, 230px 210px, 190px 230px;
                opacity: .65;
            }

            #candleScene.candle-hide {
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
            }

            .candle-content {
                position: relative;
                z-index: 3;
                width: min(96vw, 900px);
                min-height: 100dvh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 28px 18px 30px;
            }

            .candle-text {
                max-width: 650px;
                margin: 0 0 10px;
                color: rgba(255,255,255,.95);
                font-size: clamp(18px, 2.5vw, 26px);
                line-height: 1.45;
                text-shadow: 0 3px 28px rgba(0,0,0,.95);
            }

            .candle-stage {
                position: relative;
                width: min(96vw, 760px);
                height: 475px;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                perspective: 1100px;
            }

            .candle-stage::after {
                content: "";
                position: absolute;
                left: 50%;
                bottom: 23px;
                width: 570px;
                max-width: 82vw;
                height: 48px;
                transform: translateX(-50%);
                border-radius: 50%;
                background: rgba(0,0,0,.58);
                filter: blur(18px);
                z-index: 0;
            }

            .candle-plate {
                position: absolute;
                left: 50%;
                bottom: 22px;
                width: min(88vw, 650px);
                height: 76px;
                transform: translateX(-50%) rotateX(58deg);
                border-radius: 50%;
                background:
                    radial-gradient(ellipse at 50% 45%, rgba(255,255,255,.95) 0 36%, rgba(255,224,237,.72) 37% 57%, rgba(171,119,143,.45) 58% 72%, rgba(255,255,255,.16) 73% 100%);
                border: 1px solid rgba(255,255,255,.5);
                box-shadow: 0 20px 35px rgba(0,0,0,.6), inset 0 4px 12px rgba(255,255,255,.8);
                z-index: 1;
            }

            .candle-cake {
                position: absolute;
                left: 50%;
                bottom: 43px;
                width: min(80vw, 560px);
                height: 350px;
                transform: translateX(-50%);
                filter: drop-shadow(0 28px 30px rgba(0,0,0,.52));
                isolation: isolate;
                z-index: 2;
            }

            .candle-cake-base {
                position: absolute;
                left: 4%;
                right: 4%;
                bottom: 28px;
                height: 185px;
                border-radius: 28px 28px 48px 48px;
                background:
                    linear-gradient(90deg, rgba(154,65,93,.24), transparent 16%, transparent 82%, rgba(116,49,73,.18)),
                    linear-gradient(180deg, #fff5f8 0%, #f9d4e0 42%, #e5a0b9 100%);
                border: 1px solid rgba(255,255,255,.65);
                box-shadow:
                    inset 0 13px 24px rgba(255,255,255,.58),
                    inset 0 -20px 24px rgba(116,43,69,.13),
                    0 9px 0 #c47794;
                z-index: 2;
            }

            .candle-cake-base::before {
                content: "";
                position: absolute;
                left: -2px;
                right: -2px;
                top: 82px;
                height: 26px;
                border-radius: 50%;
                background: linear-gradient(180deg,#fff 0%,#ffeaf2 55%,#edb4c8 100%);
                box-shadow: 0 4px 0 rgba(183,101,130,.25), 0 9px 12px rgba(110,46,69,.12);
            }

            .candle-cake-base::after {
                content: "";
                position: absolute;
                inset: 15px 23px 24px;
                border-radius: 22px;
                background: repeating-linear-gradient(0deg, rgba(255,255,255,.17) 0 3px, transparent 3px 18px);
                opacity: .65;
            }

            .candle-cake-top {
                position: absolute;
                left: 1%;
                right: 1%;
                top: 95px;
                height: 115px;
                border-radius: 50%;
                background: radial-gradient(ellipse at 50% 35%, #fff 0 18%, #fff0f5 45%, #eaaec4 100%);
                border: 1px solid rgba(255,255,255,.75);
                box-shadow: inset 0 14px 20px rgba(255,255,255,.85), 0 13px 0 #d388a3, 0 22px 30px rgba(0,0,0,.18);
                z-index: 5;
            }

            .candle-cake-top::before {
                content: "";
                position: absolute;
                left: 12px;
                right: 12px;
                bottom: -42px;
                height: 68px;
                background: #fff5f8;
                clip-path: polygon(0 0,100% 0,100% 42%,95% 44%,92% 90%,87% 45%,79% 43%,75% 78%,69% 44%,60% 47%,56% 94%,49% 46%,40% 44%,35% 76%,29% 44%,20% 45%,15% 89%,10% 45%,0 42%);
                filter: drop-shadow(0 5px 4px rgba(151,75,102,.18));
            }

            .candle-cake-top::after {
                content: "";
                position: absolute;
                left: 8%;
                right: 8%;
                top: 20px;
                height: 54px;
                border-radius: 50%;
                background:
                    radial-gradient(circle at 12% 55%, #e54d68 0 7px, transparent 8px),
                    radial-gradient(circle at 27% 38%, #ff9eb5 0 6px, transparent 7px),
                    radial-gradient(circle at 44% 62%, #d93f61 0 7px, transparent 8px),
                    radial-gradient(circle at 61% 36%, #f86e8e 0 6px, transparent 7px),
                    radial-gradient(circle at 77% 60%, #df496a 0 7px, transparent 8px),
                    radial-gradient(circle at 91% 39%, #ff9fb6 0 6px, transparent 7px);
                opacity: .95;
            }

            .candle-cake::before {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: 20px;
                height: 48px;
                border-radius: 50%;
                background:
                    radial-gradient(ellipse at 6% 50%, #fff 0 18px, transparent 19px),
                    radial-gradient(ellipse at 18% 50%, #fff 0 18px, transparent 19px),
                    radial-gradient(ellipse at 30% 50%, #fff 0 18px, transparent 19px),
                    radial-gradient(ellipse at 42% 50%, #fff 0 18px, transparent 19px),
                    radial-gradient(ellipse at 54% 50%, #fff 0 18px, transparent 19px),
                    radial-gradient(ellipse at 66% 50%, #fff 0 18px, transparent 19px),
                    radial-gradient(ellipse at 78% 50%, #fff 0 18px, transparent 19px),
                    radial-gradient(ellipse at 90% 50%, #fff 0 18px, transparent 19px);
                filter: drop-shadow(0 4px 3px rgba(109,51,72,.18));
                z-index: 9;
            }

            .candle-decoration { position:absolute; z-index:10; pointer-events:none; }
            .candle-berry {
                width: 38px; height: 38px; border-radius: 52% 52% 45% 45%;
                background: radial-gradient(circle at 30% 24%, #ffbdc7 0 8%, #ed536d 20% 58%, #a31f43 100%);
                box-shadow: inset -7px -8px 10px rgba(74,0,24,.22), 0 6px 9px rgba(50,15,25,.25);
            }
            .candle-berry::before {
                content:"✦"; position:absolute; left:50%; top:-11px; transform:translateX(-50%);
                color:#6d9a62; font-size:17px;
            }
            .berry-1 { left:16%; top:126px; transform:rotate(-8deg) scale(.9); }
            .berry-2 { left:29%; top:112px; transform:rotate(8deg) scale(1.1); }
            .berry-3 { right:29%; top:111px; transform:rotate(-5deg) scale(1.06); }
            .berry-4 { right:15%; top:128px; transform:rotate(8deg) scale(.9); }
            .candle-flower { width:38px; height:38px; color:#fff9ef; font-size:30px; line-height:38px; text-shadow:0 2px 5px rgba(75,30,45,.22); }
            .flower-1 { left:8%; top:145px; }
            .flower-2 { right:8%; top:141px; transform:scale(.88); }

            .number-candle {
                position:absolute;
                top:-13px;
                z-index:18;
                width:235px;
                height:220px;
                overflow:visible;
                filter: drop-shadow(0 12px 9px rgba(61,17,31,.34));
            }
            .number-candle-2 { left:calc(50% - 226px); }
            .number-candle-5 { right:calc(50% - 226px); }

            .number-candle svg { width:100%; height:100%; overflow:visible; }
            .number-candle .wax-number {
                font-family: "Arial Rounded MT Bold", "Trebuchet MS", Arial, sans-serif;
                font-size: 188px;
                font-weight: 900;
                letter-spacing: -16px;
                paint-order: stroke fill;
                stroke: #a72e52;
                stroke-width: 13px;
                stroke-linejoin: round;
                fill: url(#waxPink);
                filter: url(#waxShadow);
            }
            .number-candle .wax-highlight {
                font-family: "Arial Rounded MT Bold", "Trebuchet MS", Arial, sans-serif;
                font-size: 188px;
                font-weight: 900;
                letter-spacing: -16px;
                fill: none;
                stroke: rgba(255,255,255,.72);
                stroke-width: 4px;
                stroke-linejoin: round;
                opacity: .8;
            }
            .number-candle .wax-heart { fill:#d93e65; opacity:.9; }
            .number-candle .wax-dot { fill:#fff5f7; opacity:.75; }

            .number-flame {
                position:absolute;
                left:50%;
                top:-58px;
                width:45px;
                height:70px;
                transform:translateX(-50%);
                z-index:30;
                border-radius:55% 45% 55% 45%;
                background:
                    radial-gradient(ellipse at 50% 73%, #fff 0 15%, #fff5b0 16% 33%, transparent 34%),
                    linear-gradient(180deg,#fffbd8 0%,#ffc95e 45%,#ff7356 100%);
                box-shadow:0 0 12px rgba(255,236,151,.95),0 0 30px rgba(255,168,74,.9),0 0 62px rgba(255,100,130,.34);
                transform-origin:50% 100%;
                animation:numberFlameReal .12s ease-in-out infinite alternate;
            }
            .number-flame::before {
                content:""; position:absolute; left:50%; top:-7px; width:4px; height:17px; transform:translateX(-50%);
                border-radius:50%; background:#4d3032;
            }

            .number-candle-2 .number-flame { left:49%; }
            .number-candle-5 .number-flame { left:51%; }

            .candle-smoke {
                position:absolute; z-index:40; left:50%; top:-72px; width:16px; height:16px;
                border-radius:50%; opacity:0; background:rgba(235,235,245,.68); transform:translateX(-50%); pointer-events:none;
            }
            .candle-cake.is-blown .number-flame { opacity:0; animation:none; }
            .candle-cake.is-blown .candle-smoke { animation:candleSmoke 1.9s ease-out forwards; }

            .candle-hint {
                position:relative; z-index:30; margin:0;
                color:rgba(255,218,230,.9); font-size:25px; letter-spacing:.18em; text-transform:uppercase;
                text-shadow:0 2px 15px rgba(0,0,0,.85); animation:hintPulse 1.8s ease-in-out infinite;
            }
            .candle-fallback { display:none; margin-top:12px; padding:10px 17px; border:1px solid rgba(255,190,215,.35); border-radius:999px; color:#ffeaf2; background:rgba(255,255,255,.08); backdrop-filter:blur(8px); cursor:pointer; }
            .candle-fallback.show { display:inline-flex; }

            .candle-heart-burst { position:fixed; inset:0; z-index:100000; pointer-events:none; overflow:hidden; }
            .candle-burst-heart { position:absolute; left:50%; top:50%; color:var(--heart-color); font-size:var(--size); line-height:1; opacity:0; filter:drop-shadow(0 0 8px rgba(255,130,175,.6)); animation:candleHeartFly var(--duration) cubic-bezier(.15,.7,.2,1) forwards; animation-delay:inherit; }

            @keyframes numberFlameReal {
                from { transform:translateX(-50%) rotate(-5deg) scale(.92,.96); }
                to { transform:translateX(-50%) rotate(5deg) scale(1.07,1.03); }
            }
            @keyframes hintPulse { 0%,100%{opacity:.55;transform:translateY(0)} 50%{opacity:1;transform:translateY(-2px)} }
            @keyframes candleSmoke { 0%{opacity:.72;transform:translate(-50%,0) scale(.65);filter:blur(1px)} 45%{opacity:.42} 100%{opacity:0;transform:translate(34px,-105px) scale(3.4);filter:blur(8px)} }
            @keyframes candleHeartFly { 0%{opacity:0;transform:translate(-50%,-50%) scale(.2) rotate(0)} 10%{opacity:1} 100%{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(var(--scale)) rotate(var(--rotate))} }

            @media(max-width:600px){
                .candle-content{padding:18px 10px 24px}
                .candle-text{font-size:16px;line-height:1.4;margin-bottom:2px}
                .candle-stage{width:100vw;height:360px;transform:scale(.78);transform-origin:center bottom;margin-bottom:-40px}
                .number-candle{width:205px;height:195px}
                .number-candle-2{left:calc(50% - 198px)}
                .number-candle-5{right:calc(50% - 198px)}
                .number-candle .wax-number,.number-candle .wax-highlight{font-size:170px}
                .candle-hint{font-size:25px}
            }
        `;

        document.head.appendChild(style);
    }

 function openCandleScene() {

    addCandleStyles();

    if (candleScene) {
        candleScene.remove();
    }

    candleBlown = false;

    candleScene =
        document.createElement("div");

    candleScene.id =
        "candleScene";

    candleScene.setAttribute(
        "role",
        "dialog"
    );

    candleScene.setAttribute(
        "aria-label",
        "Lilin ulang tahun angka 25"
    );

    candleScene.innerHTML = `

        <div class="candle-content">

            <div class="candle-stage">

                <!-- PLATE -->

                <div class="candle-plate"></div>

                <!-- TABLE SHADOW -->

                <div class="table-shadow"></div>

                <!-- AMBIENT GLOW -->

                <div class="cake-glow" id="cakeGlow"></div>

                <!-- SPARKLES -->

                <span class="cake-sparkle sparkle-1">✦</span>
                <span class="cake-sparkle sparkle-2">✧</span>
                <span class="cake-sparkle sparkle-3">✦</span>
                <span class="cake-sparkle sparkle-4">✧</span>
                <span class="cake-sparkle sparkle-5">✦</span>
                <span class="cake-sparkle sparkle-6">✧</span>

                <!-- CAKE -->

                <div
                    class="candle-cake"
                    id="candleCake"
                >

                    

                    <div
                        class="number-candle number-candle-2"
                    >

                        <svg
                            viewBox="0 0 245 250"
                            aria-hidden="true"
                        >

                            <defs>

                                <linearGradient
                                    id="waxGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >

                                    <stop
                                        offset="0%"
                                        stop-color="#fffdfd"
                                    />

                                    <stop
                                        offset="18%"
                                        stop-color="#ffe9ef"
                                    />

                                    <stop
                                        offset="48%"
                                        stop-color="#ffc0d0"
                                    />

                                    <stop
                                        offset="76%"
                                        stop-color="#ed88a6"
                                    />

                                    <stop
                                        offset="100%"
                                        stop-color="#c95579"
                                    />

                                </linearGradient>

                            </defs>

                            <text
                                x="122"
                                y="204"
                                text-anchor="middle"
                                class="wax-number"
                            >2</text>

                            <text
                                x="122"
                                y="204"
                                text-anchor="middle"
                                class="wax-highlight"
                            >2</text>

                            <!-- little hearts on wax -->

                            <text
                                x="94"
                                y="112"
                                text-anchor="middle"
                                class="wax-heart"
                                font-size="15"
                            >♥</text>

                            <text
                                x="151"
                                y="160"
                                text-anchor="middle"
                                class="wax-heart"
                                font-size="11"
                            >♥</text>

                            <circle
                                class="wax-dot"
                                cx="137"
                                cy="93"
                                r="4"
                            />

                        </svg>

                        <span
                            class="number-flame"
                        ></span>

                    </div>


                    <div
                        class="number-candle number-candle-5"
                    >

                        <svg
                            viewBox="0 0 245 250"
                            aria-hidden="true"
                        >

                            <defs>

                                <linearGradient
                                    id="waxGradient5"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >

                                    <stop
                                        offset="0%"
                                        stop-color="#fffdfd"
                                    />

                                    <stop
                                        offset="18%"
                                        stop-color="#ffe9ef"
                                    />

                                    <stop
                                        offset="48%"
                                        stop-color="#ffc0d0"
                                    />

                                    <stop
                                        offset="76%"
                                        stop-color="#ed88a6"
                                    />

                                    <stop
                                        offset="100%"
                                        stop-color="#c95579"
                                    />

                                </linearGradient>

                            </defs>

                            <text
                                x="122"
                                y="204"
                                text-anchor="middle"
                                class="wax-number wax-number-5"
                            >5</text>

                            <text
                                x="122"
                                y="204"
                                text-anchor="middle"
                                class="wax-highlight"
                            >5</text>

                            <text
                                x="98"
                                y="105"
                                text-anchor="middle"
                                class="wax-heart"
                                font-size="14"
                            >♥</text>

                            <text
                                x="153"
                                y="158"
                                text-anchor="middle"
                                class="wax-heart"
                                font-size="11"
                            >♥</text>

                            <circle
                                class="wax-dot"
                                cx="138"
                                cy="89"
                                r="4"
                            />

                        </svg>

                        <span
                            class="number-flame"
                        ></span>

                    </div>


                    <div
                        class="strawberry berry-1"
                    ></div>

                    <div
                        class="strawberry berry-2"
                    ></div>

                    <div
                        class="strawberry berry-3"
                    ></div>

                    <div
                        class="strawberry berry-4"
                    ></div>

                    <div
                        class="strawberry berry-5"
                    ></div>

                    <div
                        class="strawberry-cut cut-1"
                    ></div>

                    <div
                        class="strawberry-cut cut-2"
                    ></div>


                    <div
                        class="cake-flower flower-1"
                    >
                        ✿
                    </div>

                    <div
                        class="cake-flower flower-2"
                    >
                        ✿
                    </div>

                    <div class="cream-swirl cream-1"></div>
                    <div class="cream-swirl cream-2"></div>
                    <div class="cream-swirl cream-3"></div>
                    <div class="cream-swirl cream-4"></div>
                    <div class="cream-swirl cream-5"></div>
                    <div class="cream-swirl cream-6"></div>
                    <div class="cream-swirl cream-7"></div>
                    <div class="cream-swirl cream-8"></div>


                    <div
                        class="cake-ribbon ribbon-left"
                    >

                        <span
                            class="bow left"
                        ></span>

                        <span
                            class="bow right"
                        ></span>

                        <span
                            class="knot"
                        ></span>

                        <span
                            class="tail left"
                        ></span>

                        <span
                            class="tail right"
                        ></span>

                    </div>

                    <div
                        class="cake-ribbon ribbon-right"
                    >

                        <span
                            class="bow left"
                        ></span>

                        <span
                            class="bow right"
                        ></span>

                        <span
                            class="knot"
                        ></span>

                        <span
                            class="tail left"
                        ></span>

                        <span
                            class="tail right"
                        ></span>

                    </div>


                    <span class="cake-heart heart-1">
                        ♥
                    </span>

                    <span class="cake-heart heart-2">
                        ♥
                    </span>

                    <span class="cake-heart heart-3">
                        ♥
                    </span>

                    <span class="cake-heart heart-4">
                        ♥
                    </span>

                    <span class="cake-heart heart-5">
                        ♥
                    </span>


                    <div
                        class="candle-cake-top"
                    ></div>

                    <div
                        class="candle-cake-base"
                    ></div>


                    <div
                        class="candle-smoke"
                        id="candleSmoke"
                    ></div>

                </div>

            </div>

            <p class="candle-hint">
                Tiup lilinnya sayaang♡
            </p>

            <button
                type="button"
                class="candle-fallback"
                id="candleFallback"
            >
                Padamkan di sini ♡
            </button>

        </div>
    `;

    document.body.appendChild(
        candleScene
    );

    document.body.classList.add(
        "candle-active"
    );

    const fallback =
        candleScene.querySelector(
            "#candleFallback"
        );

    if (fallback) {

        fallback.addEventListener(
            "click",
            extinguishCandle
        );

    }

}

    function addCandleStyles() {

    if (document.getElementById("candle-inline-styles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "candle-inline-styles";

    style.textContent = `

    body.candle-active {
        overflow: hidden !important;
    }

    #candleScene {
        position: fixed;
        inset: 0;
        z-index: 99999;
        overflow: hidden;

        display: flex;
        align-items: center;
        justify-content: center;

        background:
            radial-gradient(
                circle at 50% 35%,
                rgba(255, 113, 67, .16),
                transparent 18%
            ),
            radial-gradient(
                circle at 50% 55%,
                rgba(143, 43, 69, .20),
                transparent 38%
            ),
            radial-gradient(
                circle at 50% 100%,
                rgba(255, 130, 156, .10),
                transparent 48%
            ),
            linear-gradient(
                180deg,
                #030303 0%,
                #090608 48%,
                #12090e 100%
            );

        opacity: 1;
        visibility: visible;

        transition:
            opacity .9s ease,
            visibility .9s ease;
    }

    #candleScene::before {
        content: "";

        position: absolute;
        inset: 0;

        background:
            radial-gradient(
                circle at 8% 20%,
                rgba(255,255,255,.12) 0 2px,
                transparent 4px
            ),
            radial-gradient(
                circle at 18% 70%,
                rgba(255,145,170,.08) 0 3px,
                transparent 7px
            ),
            radial-gradient(
                circle at 83% 22%,
                rgba(255,180,140,.12) 0 3px,
                transparent 8px
            ),
            radial-gradient(
                circle at 92% 65%,
                rgba(255,120,150,.09) 0 3px,
                transparent 7px
            );

        filter: blur(.5px);
        pointer-events: none;
    }

    #candleScene::after {
        content: "";

        position: absolute;
        inset: 0;

        background:
            radial-gradient(
                ellipse at center bottom,
                rgba(255,92,130,.10),
                transparent 48%
            );

        pointer-events: none;
    }

    .candle-content {
        position: relative;
        z-index: 10;

        width: min(96vw, 1050px);
        height: 100dvh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding:
            30px
            20px
            25px;

        text-align: center;
    }

    .candle-text {
        position: relative;
        z-index: 30;

        max-width: 700px;

        margin:
            0
            0
            8px;

        color: rgba(255,245,247,.96);

        font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

        font-size:
            clamp(20px, 3vw, 31px);

        line-height: 1.35;

        font-weight: 400;

        letter-spacing: .015em;

        text-shadow:
            0 2px 15px rgba(0,0,0,.95),
            0 0 25px rgba(255,130,150,.08);

        animation:
            candleTextIn
            1s
            cubic-bezier(.22,1,.36,1)
            both;
    }

    .candle-stage {
        position: relative;

        width: min(760px, 92vw);
        height: min(430px, 52vh);

        min-height: 385px;

        display: flex;
        align-items: flex-end;
        justify-content: center;

        perspective: 1200px;

        animation:
            cakeStageIn
            1.1s
            .15s
            cubic-bezier(.22,1,.36,1)
            both;
    }

    .candle-plate {
        position: absolute;

        left: 50%;
        bottom: 18px;

        width: min(520px, 78vw);
        height: 80px;

        transform:
            translateX(-50%)
            rotateX(60deg);

        border-radius: 50%;

        background:
            radial-gradient(
                ellipse at 50% 45%,
                rgba(255,255,255,.95) 0 34%,
                rgba(255,225,233,.80) 35% 56%,
                rgba(185,125,145,.55) 57% 72%,
                rgba(255,255,255,.15) 73% 100%
            );

        border:
            1px solid
            rgba(255,255,255,.55);

        box-shadow:
            0 22px 38px rgba(0,0,0,.75),
            inset 0 5px 15px rgba(255,255,255,.85);

        z-index: 1;
    }

    .candle-stage .table-shadow {
        position: absolute;

        left: 50%;
        bottom: 34px;

        width: min(480px, 74vw);
        height: 42px;

        transform:
            translateX(-50%);

        border-radius: 50%;

        background:
            rgba(0,0,0,.75);

        filter: blur(20px);

        z-index: 0;
    }

    .candle-cake {
        position: absolute;

        left: 50%;
        bottom: 40px;

        width: min(620px, 78vw);
        height: 410px;

        transform:
            translateX(-50%)
            scale(.72);

        transform-origin:
            50% 100%;

        filter:
            drop-shadow(
                0 30px 30px
                rgba(0,0,0,.58)
            );

        isolation: isolate;

        z-index: 5;
    }

    .candle-cake-base {
        position: absolute;

        left: 3%;
        right: 3%;
        bottom: 25px;

        height: 245px;

        border-radius:
            30px
            30px
            55px
            55px;

        background:
            linear-gradient(
                90deg,
                rgba(166,83,101,.10),
                transparent 12%,
                transparent 87%,
                rgba(121,53,71,.13)
            ),
            linear-gradient(
                180deg,
                #fffafa 0%,
                #fff0f2 23%,
                #f7d8de 55%,
                #e9b5c1 100%
            );

        border:
            1px solid
            rgba(255,255,255,.75);

        box-shadow:
            inset 0 13px 25px
            rgba(255,255,255,.75),

            inset 0 -25px 35px
            rgba(126,54,73,.12),

            0 10px 0
            #c98299;

        z-index: 2;
    }

    .candle-cake-base::after {
        content: "";

        position: absolute;
        inset: 18px 25px 25px;

        border-radius: 25px;

        background:
            repeating-linear-gradient(
                0deg,
                rgba(255,255,255,.20) 0 2px,
                transparent 2px 19px
            );

        opacity: .6;
    }

    .candle-cake-top {
        position: absolute;

        left: 0;
        right: 0;

        top: 72px;

        height: 165px;

        border-radius: 50%;

        background:
            radial-gradient(
                ellipse at 50% 28%,
                #ffffff 0%,
                #fff9fa 22%,
                #ffeef3 55%,
                #e8a9bd 100%
            );

        border:
            1px solid
            rgba(255,255,255,.9);

        box-shadow:
            inset 0 17px 25px
            rgba(255,255,255,.95),

            inset 0 -10px 18px
            rgba(185,93,119,.15),

            0 14px 0
            #d38aa1,

            0 25px 30px
            rgba(0,0,0,.17);

        z-index: 8;
    }

    .candle-cake-top::before {
        content: "";

        position: absolute;

        left: 10px;
        right: 10px;

        bottom: -58px;

        height: 82px;

        background:
            #fff7f8;

        clip-path:
            polygon(
                0 0,
                100% 0,
                100% 48%,
                96% 50%,
                92% 95%,
                87% 51%,
                80% 49%,
                76% 82%,
                70% 49%,
                62% 52%,
                57% 94%,
                50% 50%,
                42% 49%,
                37% 80%,
                31% 49%,
                22% 51%,
                16% 91%,
                10% 50%,
                0 47%
            );

        filter:
            drop-shadow(
                0 5px 5px
                rgba(121,55,74,.18)
            );
    }

    .cream-swirl {
        position: absolute;

        width: 65px;
        height: 52px;

        border-radius:
            50%
            50%
            42%
            42%;

        background:
            radial-gradient(
                ellipse at 50% 25%,
                #ffffff 0%,
                #fff9fa 42%,
                #efd8dc 100%
            );

        box-shadow:
            inset 0 -8px 10px
            rgba(157,79,100,.12),

            0 4px 7px
            rgba(67,25,38,.14);

        z-index: 15;
    }

    .cream-swirl::before,
    .cream-swirl::after {
        content: "";

        position: absolute;

        left: 50%;
        transform: translateX(-50%);

        border-radius: 50%;

        background:
            linear-gradient(
                180deg,
                #ffffff,
                #f2dfe2
            );
    }

    .cream-swirl::before {
        width: 52px;
        height: 25px;
        top: 10px;
    }

    .cream-swirl::after {
        width: 37px;
        height: 18px;
        top: 2px;
    }

    .cream-1 {
        left: 5%;
        top: 165px;
        transform: rotate(-8deg);
    }

    .cream-2 {
        left: 15%;
        top: 178px;
        transform: rotate(4deg) scale(.92);
    }

    .cream-3 {
        left: 27%;
        top: 170px;
        transform: rotate(-5deg) scale(1.05);
    }

    .cream-4 {
        left: 40%;
        top: 181px;
        transform: scale(.95);
    }

    .cream-5 {
        right: 40%;
        top: 180px;
        transform: rotate(4deg) scale(.98);
    }

    .cream-6 {
        right: 27%;
        top: 170px;
        transform: rotate(-4deg) scale(1.05);
    }

    .cream-7 {
        right: 15%;
        top: 178px;
        transform: rotate(5deg) scale(.92);
    }

    .cream-8 {
        right: 5%;
        top: 164px;
        transform: rotate(8deg);
    }

    .strawberry {
        position: absolute;

        width: 52px;
        height: 58px;

        border-radius:
            48%
            48%
            54%
            54%;

        background:
            radial-gradient(
                circle at 30% 20%,
                #ffb1ba 0 5%,
                transparent 6%
            ),
            radial-gradient(
                circle at 62% 38%,
                #ffd5d9 0 3%,
                transparent 4%
            ),
            linear-gradient(
                145deg,
                #ff5b68,
                #d92d46 55%,
                #8f1933
            );

        box-shadow:
            inset -9px -11px 13px
            rgba(72,0,20,.24),

            0 7px 12px
            rgba(55,10,20,.3);

        z-index: 20;
    }

    .strawberry::before {
        content: "";

        position: absolute;

        left: 50%;
        top: -11px;

        width: 30px;
        height: 17px;

        transform:
            translateX(-50%);

        background:
            radial-gradient(
                ellipse at center,
                #6f9d5d,
                #3f713e
            );

        clip-path:
            polygon(
                50% 100%,
                0 35%,
                30% 45%,
                23% 0,
                50% 36%,
                77% 0,
                70% 45%,
                100% 35%
            );
    }

    .strawberry::after {
        content: "";

        position: absolute;

        width: 4px;
        height: 6px;

        border-radius: 50%;

        background:
            #ffe7d4;

        left: 17px;
        top: 25px;

        box-shadow:
            17px 5px #ffe7d4,
            7px 17px #ffe7d4,
            26px 22px #ffe7d4;
    }

    .berry-1 {
        left: 13%;
        top: 117px;
        transform: rotate(-13deg) scale(.95);
    }

    .berry-2 {
        left: 27%;
        top: 102px;
        transform: rotate(7deg) scale(1.1);
    }

    .berry-3 {
        right: 27%;
        top: 100px;
        transform: rotate(-5deg) scale(1.12);
    }

    .berry-4 {
        right: 13%;
        top: 118px;
        transform: rotate(12deg) scale(.95);
    }

    .berry-5 {
        left: 43%;
        top: 125px;
        transform: rotate(-3deg) scale(.75);
    }

    .strawberry-cut {
        position: absolute;

        width: 55px;
        height: 70px;

        border-radius:
            55%
            55%
            45%
            45%;

        background:
            radial-gradient(
                circle at 50% 35%,
                #fff2f2 0 13%,
                transparent 14%
            ),
            linear-gradient(
                90deg,
                #f05263,
                #ff8b96,
                #d9354d
            );

        transform:
            rotate(15deg);

        box-shadow:
            inset 0 0 0 3px
            rgba(255,255,255,.25),

            0 6px 10px
            rgba(60,10,20,.25);

        z-index: 21;
    }

    .strawberry-cut::after {
        content: "";

        position: absolute;

        width: 4px;
        height: 6px;

        border-radius: 50%;

        background: #fff4dc;

        left: 16px;
        top: 28px;

        box-shadow:
            16px 6px #fff4dc,
            9px 19px #fff4dc,
            27px 23px #fff4dc;
    }

    .cut-1 {
        left: 34%;
        top: 116px;
    }

    .cut-2 {
        right: 35%;
        top: 116px;
        transform: rotate(-13deg) scale(.9);
    }

    .cake-flower {
        position: absolute;

        width: 48px;
        height: 48px;

        z-index: 24;

        font-size: 39px;
        line-height: 48px;

        color: #fffdf5;

        text-shadow:
            0 3px 5px
            rgba(80,35,45,.28);
    }

    .cake-flower::after {
        content: "•";

        position: absolute;

        left: 50%;
        top: 0;

        transform:
            translateX(-50%);

        color: #e7a642;

        font-size: 20px;
    }

    .flower-1 {
        left: 18%;
        top: 136px;
    }

    .flower-2 {
        right: 18%;
        top: 133px;

        transform:
            scale(.9);
    }

    .cake-heart {
        position: absolute;

        z-index: 30;

        color: #c63d62;

        text-shadow:
            0 2px 4px
            rgba(80,10,30,.2);
    }

    .heart-1 {
        left: 17%;
        bottom: 98px;
        font-size: 25px;
    }

    .heart-2 {
        left: 37%;
        bottom: 70px;
        font-size: 15px;
    }

    .heart-3 {
        right: 36%;
        bottom: 105px;
        font-size: 28px;
    }

    .heart-4 {
        right: 17%;
        bottom: 82px;
        font-size: 18px;
    }

    .heart-5 {
        left: 48%;
        bottom: 58px;
        font-size: 12px;
    }

    .cake-ribbon {
        position: absolute;

        z-index: 35;

        width: 100px;
        height: 125px;
    }

    .cake-ribbon .bow {
        position: absolute;

        top: 0;

        width: 48px;
        height: 35px;

        border-radius:
            70%
            30%
            60%
            35%;

        background:
            linear-gradient(
                135deg,
                #f6b3c3,
                #b95779
            );

        box-shadow:
            inset 4px 3px 6px
            rgba(255,255,255,.42),

            0 4px 7px
            rgba(70,20,35,.2);
    }

    .cake-ribbon .bow.left {
        left: 0;
        transform: rotate(-18deg);
    }

    .cake-ribbon .bow.right {
        right: 0;
        transform: scaleX(-1) rotate(-18deg);
    }

    .cake-ribbon .knot {
        position: absolute;

        left: 50%;
        top: 8px;

        width: 24px;
        height: 24px;

        transform:
            translateX(-50%);

        border-radius: 50%;

        background:
            radial-gradient(
                circle at 35% 30%,
                #ffd8e2,
                #bc5c7c
            );
    }

    .cake-ribbon .tail {
        position: absolute;

        top: 27px;

        width: 27px;
        height: 95px;

        background:
            linear-gradient(
                90deg,
                #b95879,
                #ed9db2
            );

        clip-path:
            polygon(
                0 0,
                100% 0,
                85% 82%,
                50% 100%,
                55% 76%,
                0 86%
            );
    }

    .cake-ribbon .tail.left {
        left: 25px;
        transform: rotate(8deg);
    }

    .cake-ribbon .tail.right {
        right: 25px;
        transform: rotate(-8deg);
    }

    .ribbon-left {
        left: 1%;
        bottom: 113px;
    }

    .ribbon-right {
        right: 1%;
        bottom: 112px;
    }

    .number-candle {
        position: absolute;

        top: -42px;

        width: 245px;
        height: 250px;

        z-index: 80;

        filter:
            drop-shadow(
                0 13px 10px
                rgba(55,10,25,.40)
            );
    }

    .number-candle-2 {
        left:
            calc(50% - 178px);
    }

    .number-candle-5 {
        right:
            calc(50% - 178px);
    }

    .number-candle svg {
        width: 100%;
        height: 100%;

        overflow: visible;
    }

    .wax-number {
        font-family:
            "Arial Rounded MT Bold",
            "Trebuchet MS",
            Arial,
            sans-serif;

        font-size: 205px;

        font-weight: 900;

        letter-spacing: -18px;

        paint-order:
            stroke fill;

        stroke:
            #a92e50;

        stroke-width:
            12px;

        stroke-linejoin:
            round;

        fill:
            url(#waxGradient);
    }

    .wax-number-5 {
        fill:
            url(#waxGradient5);
    }

    .wax-highlight {
        font-family:
            "Arial Rounded MT Bold",
            "Trebuchet MS",
            Arial,
            sans-serif;

        font-size: 205px;

        font-weight: 900;

        letter-spacing: -18px;

        fill: none;

        stroke:
            rgba(255,255,255,.78);

        stroke-width:
            3px;

        stroke-linejoin:
            round;

        opacity: .85;
    }

    .wax-detail {
        fill:
            rgba(255,255,255,.72);
    }

    .wax-heart {
        fill:
            #d93f63;

        filter:
            drop-shadow(
                0 1px 2px
                rgba(100,0,20,.25)
            );
    }

    .wax-dot {
        fill:
            #fff4f7;

        opacity: .8;
    }

    .number-flame {
        position: absolute;

        left: 50%;
        top: -35px;

        width: 42px;
        height: 70px;

        transform:
            translateX(-50%);

        z-index: 100;

        border-radius:
            55%
            45%
            58%
            42%
            /
            70%
            65%
            35%
            30%;

        background:
            radial-gradient(
                ellipse at 50% 75%,
                #ffffff 0 14%,
                #fffbd0 15% 29%,
                #ffc45a 40% 57%,
                #f36b45 70%,
                transparent 72%
            );

        filter:
            drop-shadow(
                0 0 10px
                rgba(255,228,150,.95)
            )
            drop-shadow(
                0 0 27px
                rgba(255,144,66,.85)
            );

        transform-origin:
            50% 100%;

        animation:
            realisticFlame
            .65s
            ease-in-out
            infinite
            alternate;
    }

    .number-flame::before {
        content: "";

        position: absolute;

        left: 50%;
        top: -8px;

        width: 4px;
        height: 17px;

        transform:
            translateX(-50%);

        border-radius: 50%;

        background:
            #422b2d;
    }

    .number-candle-2
    .number-flame {
        left: 49%;
    }

    .number-candle-5
    .number-flame {
        left: 51%;
    }

    .candle-smoke {
        position: absolute;

        left: 50%;
        top: -80px;

        width: 120px;
        height: 190px;

        transform:
            translateX(-50%);

        z-index: 120;

        opacity: 0;

        pointer-events: none;
    }

    .candle-smoke::before,
    .candle-smoke::after {
        content: "";

        position: absolute;

        bottom: 10px;

        width: 22px;
        height: 100px;

        border-left:
            5px solid
            rgba(230,225,229,.35);

        border-radius: 50%;

        filter:
            blur(2px);
    }

    .candle-smoke::before {
        left: 40px;

        transform:
            rotate(-14deg);
    }

    .candle-smoke::after {
        right: 35px;

        transform:
            rotate(13deg);

        opacity: .55;
    }

    .candle-cake.is-blown
    .number-flame {
        opacity: 0;

        animation: none;

        transform:
            translateX(-50%)
            scale(.15)
            translateY(15px);

        transition:
            opacity .2s ease,
            transform .25s ease;
    }

    .candle-cake.is-blown
    .candle-smoke {
        opacity: 1;

        animation:
            smokeRise
            2.1s
            ease-out
            forwards;
    }

    .candle-hint {
        position: relative;

        z-index: 100;

        margin: 3px 0 0;

        color:
            rgba(245, 129, 160, 0.88);

        font-size: 25px;

        letter-spacing:
            .20em;

        text-transform:
            uppercase;

        text-shadow:
            0 2px 15px
            rgba(0,0,0,.9);

        animation:
            hintPulse
            1.8s
            ease-in-out
            infinite;
    }

    .candle-fallback {
        display: none;

        margin-top: 13px;

        padding:
            10px
            18px;

        border:
            1px solid
            rgba(255,190,215,.35);

        border-radius:
            999px;

        color:
            #ffeaf2;

        background:
            rgba(255,255,255,.08);

        backdrop-filter:
            blur(10px);

        cursor:
            pointer;

        font: inherit;
    }

    .candle-fallback.show {
        display:
            inline-flex;
    }

    .cake-glow {
        position: absolute;
        left: 50%;
        bottom: 45px;
        width: min(500px, 76vw);
        height: 300px;
        transform: translateX(-50%);
        border-radius: 50%;
        background:
            radial-gradient(
                ellipse at 50% 55%,
                rgba(255,200,150,.40) 0%,
                rgba(255,140,170,.22) 32%,
                rgba(255,90,140,.10) 55%,
                transparent 72%
            );
        filter: blur(6px);
        z-index: 3;
        pointer-events: none;
        animation: cakeGlowPulse 2.4s ease-in-out infinite;
        mix-blend-mode: screen;
    }

    .candle-cake.is-blown ~ .cake-glow,
    .cake-glow.is-blown {
        animation: none;
        opacity: .15;
        transition: opacity .8s ease;
    }

    .cake-sparkle {
        position: absolute;
        z-index: 60;
        color: #fff6d8;
        text-shadow:
            0 0 6px rgba(255,235,180,.95),
            0 0 14px rgba(255,180,150,.7);
        pointer-events: none;
        animation: sparkleTwinkle 2.6s ease-in-out infinite;
    }

    .sparkle-1 { left: 6%;  top: 30%;  font-size: 16px; animation-delay: 0s; }
    .sparkle-2 { left: 14%; top: 62%;  font-size: 11px; animation-delay: .5s; }
    .sparkle-3 { right: 8%; top: 26%;  font-size: 18px; animation-delay: 1s; }
    .sparkle-4 { right: 16%; top: 58%; font-size: 12px; animation-delay: 1.5s; }
    .sparkle-5 { left: 32%; top: 8%;   font-size: 13px; animation-delay: .8s; }
    .sparkle-6 { right: 30%; top: 6%;  font-size: 15px; animation-delay: 1.9s; }

    .candle-heart-burst {
        position: fixed;
        inset: 0;
        z-index: 100000;
        pointer-events: none;
        overflow: hidden;
    }

    .candle-burst-heart {
        position: absolute;
        left: 50%;
        top: 50%;
        color: var(--heart-color);
        font-size: var(--size);
        line-height: 1;
        opacity: 0;
        filter:
            drop-shadow(0 0 10px rgba(255,140,180,.75))
            drop-shadow(0 0 3px rgba(255,255,255,.6));
        animation:
            candleHeartFly
            var(--duration)
            cubic-bezier(.15,.7,.2,1)
            forwards;
        animation-delay: inherit;
        will-change: transform, opacity;
    }

    .candle-float-heart {
        position: fixed;
        bottom: -60px;
        left: var(--start-x);
        color: var(--heart-color);
        font-size: var(--size);
        line-height: 1;
        opacity: 0;
        filter:
            drop-shadow(0 0 8px rgba(255,150,185,.7));
        animation:
            candleHeartFloat
            var(--duration)
            ease-in
            forwards;
        will-change: transform, opacity;
    }

    @keyframes candleTextIn {

        from {
            opacity: 0;
            transform:
                translateY(25px);
        }

        to {
            opacity: 1;
            transform:
                translateY(0);
        }
    }

    @keyframes cakeStageIn {

        from {
            opacity: 0;

            transform:
                translateY(45px)
                scale(.88);
        }

        to {
            opacity: 1;

            transform:
                translateY(0)
                scale(1);
        }
    }

    @keyframes realisticFlame {

        0% {
            transform:
                translateX(-50%)
                rotate(-4deg)
                scale(.93,.98);
        }

        50% {
            transform:
                translateX(-50%)
                rotate(2deg)
                scale(1.04,1);
        }

        100% {
            transform:
                translateX(-50%)
                rotate(5deg)
                scale(1.08,1.04);
        }
    }

    @keyframes smokeRise {

        0% {
            opacity: .72;

            transform:
                translateX(-50%)
                translateY(0)
                scale(.55);
        }

        20% {
            opacity: .58;
        }

        45% {
            opacity: .38;
        }

        100% {
            opacity: 0;

            transform:
                translateX(-20px)
                translateY(-125px)
                scale(2.9);

            filter:
                blur(8px);
        }
    }

    @keyframes hintPulse {

        0%,100% {
            opacity: .45;
        }

        50% {
            opacity: 1;
        }
    }

    @keyframes cakeGlowPulse {
        0%,100% {
            opacity: .75;
            transform: translateX(-50%) scale(1);
        }
        50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.06);
        }
    }

    @keyframes sparkleTwinkle {
        0%,100% {
            opacity: 0;
            transform: scale(.4) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.15) rotate(90deg);
        }
    }

    @keyframes candleHeartFly {
        0% {
            opacity: 0;
            transform:
                translate(-50%,-50%)
                scale(.2)
                rotate(0);
        }
        12% {
            opacity: 1;
        }
        70% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform:
                translate(calc(-50% + var(--x)), calc(-50% + var(--y)))
                scale(var(--scale))
                rotate(var(--rotate));
        }
    }

    @keyframes candleHeartFloat {
        0% {
            opacity: 0;
            transform:
                translateX(0)
                translateY(0)
                scale(var(--scale))
                rotate(0deg);
        }
        10% {
            opacity: var(--peak-opacity);
        }
        80% {
            opacity: var(--peak-opacity);
        }
        100% {
            opacity: 0;
            transform:
                translateX(var(--sway))
                translateY(var(--rise))
                scale(var(--scale))
                rotate(var(--spin));
        }
    }

    @media (max-width: 600px) {

        .candle-content {
            padding:
                20px
                10px
                20px;
        }

        .candle-text {
            font-size: 17px;
            line-height: 1.4;
        }

        .candle-stage {
            width: 100vw;
            height: 340px;

            min-height: 325px;
        }

        .number-candle {
            width: 210px;
            height: 215px;
        }

        .number-candle-2 {
            left:
                calc(50% - 148px);
        }

        .number-candle-5 {
            right:
                calc(50% - 148px);
        }

        .wax-number,
        .wax-highlight {
            font-size: 178px;
        }

        .candle-hint {
            font-size: 20px;
        }
    }

    `;

    document.head.appendChild(style);
}

    function stopCandleMicrophone() {

        candleDetecting = false;

        if (candleAnimationFrame) {
            cancelAnimationFrame(candleAnimationFrame);
            candleAnimationFrame = null;
        }

        if (candleStream) {
            candleStream.getTracks().forEach(track => track.stop());
            candleStream = null;
        }

        if (candleAudioContext) {
            candleAudioContext.close().catch(() => {});
            candleAudioContext = null;
        }

        candleAnalyser = null;
    }

    async function startCandleMicrophone() {

        if (!candleScene || candleBlown) return;

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showCandleFallback();
            return;
        }

        try {

            candleStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: false
                }
            });

            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) {
                showCandleFallback();
                return;
            }

            candleAudioContext = new AudioContextClass();

            if (candleAudioContext.state === "suspended") {
                await candleAudioContext.resume().catch(() => {});
            }

            const source = candleAudioContext.createMediaStreamSource(candleStream);
            candleAnalyser = candleAudioContext.createAnalyser();
            candleAnalyser.fftSize = 512;
            candleAnalyser.smoothingTimeConstant = .18;
            source.connect(candleAnalyser);

            const data = new Uint8Array(candleAnalyser.fftSize);
            let baseline = .012;
            let loudFrames = 0;
            const startedAt = performance.now();

            candleDetecting = true;

            function detectBlow() {

                if (!candleDetecting || candleBlown || !candleAnalyser) return;

                candleAnalyser.getByteTimeDomainData(data);

                let sum = 0;

                for (let i = 0; i < data.length; i++) {
                    const normalized = (data[i] - 128) / 128;
                    sum += normalized * normalized;
                }

                const rms = Math.sqrt(sum / data.length);

                if (performance.now() - startedAt < 900) {
                    baseline = baseline * .92 + rms * .08;
                }

                const threshold = Math.max(.075, baseline * 3.2);

                if (rms > threshold && rms > .06) {
                    loudFrames++;
                } else {
                    loudFrames = Math.max(0, loudFrames - 1);
                }

                if (loudFrames >= 4 || rms > .20) {
                    extinguishCandle();
                    return;
                }

                candleAnimationFrame = requestAnimationFrame(detectBlow);
            }

            detectBlow();

        } catch (error) {
            console.warn("Microphone candle detection unavailable:", error);
            showCandleFallback();
        }
    }

    function createCandleHeartBurst() {

        const burst = document.createElement("div");
        burst.className = "candle-heart-burst";
        document.body.appendChild(burst);

        const symbols = ["♥", "♡", "❤", "♡", "♥", "✦"];
        const colors = ["#ff6f9f", "#ff9fc0", "#ffd1df", "#ffffff", "#e85d8f", "#ffd9e6"];

        const burstCount = window.innerWidth < 600 ? 90 : 150;

        for (let i = 0; i < burstCount; i++) {

            const heart = document.createElement("span");
            heart.className = "candle-burst-heart";
            heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

            const angle = Math.random() * Math.PI * 2;
            const distance = 180 + Math.random() * Math.max(window.innerWidth, window.innerHeight) * .72;

            heart.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
            heart.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
            heart.style.setProperty("--size", `${12 + Math.random() * 32}px`);
            heart.style.setProperty("--scale", `${.7 + Math.random() * 1.6}`);
            heart.style.setProperty("--rotate", `${-60 + Math.random() * 120}deg`);
            heart.style.setProperty("--duration", `${1.4 + Math.random() * 1.7}s`);
            heart.style.setProperty("--heart-color", colors[Math.floor(Math.random() * colors.length)]);
            heart.style.animationDelay = `${Math.random() * .4}s`;

            burst.appendChild(heart);
        }

        const showerDuration = 3200;
        const showerStart = performance.now();

        function spawnFloatingHeart() {

            const heart = document.createElement("span");
            heart.className = "candle-float-heart";
            heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];

            const startX = Math.random() * 100;
            const rise = window.innerHeight * (1.05 + Math.random() * .25);
            const sway = -70 + Math.random() * 140;

            heart.style.setProperty("--start-x", `${startX}vw`);
            heart.style.setProperty("--rise", `-${rise}px`);
            heart.style.setProperty("--sway", `${sway}px`);
            heart.style.setProperty("--size", `${14 + Math.random() * 26}px`);
            heart.style.setProperty("--scale", `${.8 + Math.random() * 1.1}`);
            heart.style.setProperty("--spin", `${-40 + Math.random() * 80}deg`);
            heart.style.setProperty("--peak-opacity", `${.75 + Math.random() * .25}`);
            heart.style.setProperty("--duration", `${2.6 + Math.random() * 2.4}s`);
            heart.style.setProperty("--heart-color", colors[Math.floor(Math.random() * colors.length)]);

            burst.appendChild(heart);

            setTimeout(() => heart.remove(), 5400);
        }

        const showerInterval = setInterval(() => {

            if (performance.now() - showerStart > showerDuration) {
                clearInterval(showerInterval);
                return;
            }

            const wave = window.innerWidth < 600 ? 3 : 5;
            for (let i = 0; i < wave; i++) {
                spawnFloatingHeart();
            }

        }, 140);

        setTimeout(() => burst.remove(), showerDuration + 5600);
    }

    function closeCandleScene() {

        stopCandleMicrophone();

        if (!candleScene) return;

        candleScene.classList.add("candle-hide");
        document.body.classList.remove("candle-active");

        setTimeout(() => {

            if (candleScene) {
                candleScene.remove();
                candleScene = null;
            }

            if (website) {
                website.classList.remove("hidden");
                website.classList.add("is-visible");
            }

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

        }, 1050);
    }

    function extinguishCandle() {

        if (candleBlown || !candleScene) return;

        candleBlown = true;
        stopCandleMicrophone();

        playMusic();

        const cake = candleScene.querySelector("#candleCake");
        if (cake) cake.classList.add("is-blown");

        const glow = candleScene.querySelector("#cakeGlow");
        if (glow) glow.classList.add("is-blown");

        createCandleHeartBurst();

        setTimeout(() => {
            closeCandleScene();
        }, 1350);
    }

    updateMusicUI();

    if (website) {

        website.classList.add(
            "hidden"
        );

    }

    if (zipperHandle) {

        zipperHandle.style.top =
            "8px";

    }

    requestAnimationFrame(
        () => {

            resetClueZipper();

            resetAllGiftPositions();

        }
    );

});
