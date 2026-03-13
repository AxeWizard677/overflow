let cameraStarted = false;

async function startCamera() {
  if (cameraStarted) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
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
  overlay.style.display =
    window.innerHeight > window.innerWidth ? "flex" : "none";
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
      if (element.requestFullscreen) await element.requestFullscreen();
      else if (element.webkitRequestFullscreen)
        await element.webkitRequestFullscreen();
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

document
  .getElementById("fullscreen-btn")
  .addEventListener("click", async () => {
    await startCamera();
    await goFullscreen();
    hideFullscreenPopup();
    checkOrientation();
  });

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);

document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) hideFullscreenPopup();
  else showFullscreenPopup();
  checkOrientation();
});

const visor = document.querySelector(".wrapper svg");
const shootButton = document.querySelector(".button span");

shootButton.addEventListener("click", () => {
  visor.classList.remove("shoot");
  void visor.offsetWidth;
  visor.classList.add("shoot");
});

visor.addEventListener("animationend", () => {
  visor.classList.remove("shoot");
});

showFullscreenPopup();
checkOrientation();

// --- Bouncing monsters ---
const SPEED = 3;

const monsters = [
  { id: "monster-1", x: 100, y: 100, dx: SPEED, dy: SPEED },
  { id: "monster-2", x: 300, y: 200, dx: -SPEED, dy: SPEED },
  { id: "monster-3", x: 200, y: 300, dx: SPEED, dy: -SPEED },
];

function animate() {
  monsters.forEach((m) => {
    const el = document.getElementById(m.id);
    if (!el) return;

    // Read size from CSS (vmin) — no JS size management needed
    const size = el.offsetWidth;
    const maxX = window.innerWidth - size;
    const maxY = window.innerHeight - size;

    m.x += m.dx;
    m.y += m.dy;

    if (m.x <= 0) {
      m.x = 0;
      m.dx = Math.abs(m.dx);
    }
    if (m.x >= maxX) {
      m.x = maxX;
      m.dx = -Math.abs(m.dx);
    }
    if (m.y <= 0) {
      m.y = 0;
      m.dy = Math.abs(m.dy);
    }
    if (m.y >= maxY) {
      m.y = maxY;
      m.dy = -Math.abs(m.dy);
    }

    el.style.transform = `translate(${m.x}px, ${m.y}px)`;
  });

  requestAnimationFrame(animate);
}

animate();
startCamera();
