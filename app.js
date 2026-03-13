async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        const video = document.getElementById("camera-bg");
        video.srcObject = stream;

    } catch (err) {
        console.error("Camera access denied:", err);
    }
}

startCamera();