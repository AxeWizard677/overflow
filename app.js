let cameraStarted = false;

async function startCamera() {
    if (cameraStarted) return;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: "environment" }
            },
            audio: false
        });

        const video = document.getElementById("camera-bg");
        video.srcObject = stream;
        cameraStarted = true;
    } catch (err) {
        console.error("Camera access denied:", err);
    }
}

function checkOrientation() {
    const overlay = document.getElementById("rotate-overlay");

    if (window.innerHeight > window.innerWidth) {
        overlay.style.display = "flex";
    } else {
        overlay.style.display = "none";
    }
}

function showFullscreenPopup() {
    document.getElementById("fullscreen-popup").classList.remove("hidden");
}

function hideFullscreenPopup() {
    document.getElementById("fullscreen-popup").classList.add("hidden");
}

async function goFullscreen() {
    const element = document.documentElement;

    try {
        if (!document.fullscreenElement) {
            if (element.requestFullscreen) {
                await element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                await element.webkitRequestFullscreen();
            }
        }

        if (screen.orientation?.lock) {
            try {
                await screen.orientation.lock("landscape");
            } catch (err) {
                console.log("Orientation lock not supported:", err);
            }
        }
    } catch (err) {
        console.error("Fullscreen error:", err);
    }
}

document.getElementById("fullscreen-btn").addEventListener("click", async () => {
    await startCamera();
    await goFullscreen();
    hideFullscreenPopup();
    checkOrientation();
});

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        hideFullscreenPopup();
    } else {
        showFullscreenPopup();
    }
    checkOrientation();
});

const visor = document.querySelector(".wrapper svg");
const shootButton = document.querySelector(".button a");

shootButton.addEventListener("click", (event) => {
    event.preventDefault();

    visor.classList.remove("shoot");
    void visor.offsetWidth;
    visor.classList.add("shoot");
});

visor.addEventListener("animationend", () => {
    visor.classList.remove("shoot");
});

showFullscreenPopup();
checkOrientation();