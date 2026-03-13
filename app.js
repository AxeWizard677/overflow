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
        // portrait -> ask user to rotate to landscape
        overlay.style.display = "flex";
    } else {
        // landscape
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

        if (screen.orientation && screen.orientation.lock) {
            try {
                await screen.orientation.lock("landscape");
            } catch (err) {
                console.log("Orientation lock not supported:", err);
            }
        }

        hideFullscreenPopup();
    } catch (err) {
        console.error("Fullscreen error:", err);
    }
}

const fullscreenButton = document.getElementById("fullscreen-btn");

fullscreenButton.addEventListener("click", async () => {
    await startCamera();
    await goFullscreen();
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

document.addEventListener("webkitfullscreenchange", () => {
    const isFullscreen = document.webkitFullscreenElement;

    if (isFullscreen) {
        hideFullscreenPopup();
    } else {
        showFullscreenPopup();
    }

    checkOrientation();
});

showFullscreenPopup();
checkOrientation();