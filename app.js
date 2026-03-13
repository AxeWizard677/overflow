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

var box = document.getElementById("monsters"),
  win = window,
  ww = win.innerWidth,
  wh = win.innerHeight,
  translateX = Math.floor(Math.random() * ww + 1),
  translateY = Math.floor(Math.random() * wh + 1),
  boxWidth = box.offsetWidth,
  boxHeight = box.offsetHeight,
  boxTop = box.offsetTop,
  boxLeft = box.offsetLeft,
  xMin = -boxLeft,
  yMin = -boxTop,
  xMax = win.innerWidth - boxLeft - boxWidth,
  yMax = win.innerHeight - boxTop - boxHeight,
  request = null,
  direction = "se",
  speed = 4,
  timeout = null;

init();

// reset constraints on resize
window.addEventListener(
  "resize",
  function (argument) {
    clearTimeout(timeout);
    timeout = setTimeout(update, 100);
  },
  false,
);

function init() {
  request = requestAnimationFrame(init);
  move();
  // setInterval(function() {
  //   move();
  // }, 16.66);
}

// reset constraints
function update() {
  xMin = -boxLeft;
  yMin = -boxTop;
  xMax = win.innerWidth - boxLeft - boxWidth;
  yMax = win.innerHeight - boxTop - boxHeight;
}

function move() {
  setDirection();
  setStyle(box, {
    transform: "translate3d(" + translateX + "px, " + translateY + "px, 0)",
  });
}

function setDirection() {
  switch (direction) {
    case "ne":
      translateX += speed;
      translateY -= speed;
      break;
    case "nw":
      translateX -= speed;
      translateY -= speed;
      break;
    case "se":
      translateX += speed;
      translateY += speed;
      break;
    case "sw":
      translateX -= speed;
      translateY += speed;
      break;
  }
  setLimits();
}

function setLimits() {
  if (translateY <= yMin) {
    if (direction == "nw") {
      direction = "sw";
    } else if (direction == "ne") {
      direction = "se";
    }
  }
  if (translateY >= yMax) {
    if (direction == "se") {
      direction = "ne";
    } else if (direction == "sw") {
      direction = "nw";
    }
  }
  if (translateX <= xMin) {
    if (direction == "nw") {
      direction = "ne";
    } else if (direction == "sw") {
      direction = "se";
    }
  }
  if (translateX >= xMax) {
    if (direction == "ne") {
      direction = "nw";
    } else if (direction == "se") {
      direction = "sw";
    }
  }
}

function getVendor() {
  var ua = navigator.userAgent.toLowerCase(),
    match =
      /opera/.exec(ua) ||
      /msie/.exec(ua) ||
      /firefox/.exec(ua) ||
      /(chrome|safari)/.exec(ua) ||
      /trident/.exec(ua),
    vendors = {
      opera: "-o-",
      chrome: "-webkit-",
      safari: "-webkit-",
      firefox: "-moz-",
      trident: "-ms-",
      msie: "-ms-",
    };

  return vendors[match[0]];
}

function setStyle(element, properties) {
  var prefix = getVendor(),
    property,
    css = "";
  for (property in properties) {
    css += property + ": " + properties[property] + ";";
    css += prefix + property + ": " + properties[property] + ";";
  }
  element.style.cssText += css;
}

lockOrientation();

startCamera();
