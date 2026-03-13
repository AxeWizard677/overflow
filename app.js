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

async function lockOrientation() {
  try {
    await screen.orientation.lock("landscape");
  } catch (err) {
    console.log("Orientation lock not supported", err);
  }
}

lockOrientation();

startCamera();