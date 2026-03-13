let cameraStarted = false;

async function startCamera() {
  if (cameraStarted) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
      },
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
  if (document.fullscreenElement) {
    hideFullscreenPopup();
  } else {
    showFullscreenPopup();
  }
  checkOrientation();
});

const visor = document.querySelector(".wrapper svg");
const shootButton = document.querySelector(".button span");

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

// --- Bouncing monsters ---
const speed = 3;
const MONSTER_SIZE = 500;

const monsters = [
  {
    id: "monster-1",
    x: Math.random() * (window.innerWidth - MONSTER_SIZE),
    y: Math.random() * (window.innerHeight - MONSTER_SIZE),
    dir: "se",
  },
  {
    id: "monster-2",
    x: Math.random() * (window.innerWidth - MONSTER_SIZE),
    y: Math.random() * (window.innerHeight - MONSTER_SIZE),
    dir: "ne",
  },
  {
    id: "monster-3",
    x: Math.random() * (window.innerWidth - MONSTER_SIZE),
    y: Math.random() * (window.innerHeight - MONSTER_SIZE),
    dir: "sw",
  },
];

function animateMonsters() {
  monsters.forEach((m) => {
    const el = document.getElementById(m.id);
    if (!el) return;

    const maxX = window.innerWidth - MONSTER_SIZE;
    const maxY = window.innerHeight - MONSTER_SIZE;

    if (m.dir.includes("e")) m.x += speed;
    else m.x -= speed;

    if (m.dir.includes("s")) m.y += speed;
    else m.y -= speed;

    // Clamp and bounce
    if (m.x <= 0) {
      m.x = 0;
      m.dir = m.dir.replace("w", "e");
    }
    if (m.x >= maxX) {
      m.x = maxX;
      m.dir = m.dir.replace("e", "w");
    }
    if (m.y <= 0) {
      m.y = 0;
      m.dir = m.dir.replace("n", "s");
    }
    if (m.y >= maxY) {
      m.y = maxY;
      m.dir = m.dir.replace("s", "n");
    }

    el.style.transform = `translate3d(${m.x}px, ${m.y}px, 0)`;
  });

  requestAnimationFrame(animateMonsters);
}

animateMonsters();

startCamera();
