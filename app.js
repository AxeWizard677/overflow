async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: { ideal: "environment" }
        },
        audio: false
        });

        const video = document.getElementById("camera-bg");
        video.srcObject = stream;

    } catch (err) {
        console.error("Camera access denied:", err);
    }
}

function checkOrientation() {

    const overlay = document.getElementById("rotate-overlay");

    if (window.innerHeight < window.innerWidth) {
        // paysage
        overlay.style.display = "flex";
    } else {
        // portrait
        overlay.style.display = "none";
    }
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);

checkOrientation();

startCamera();