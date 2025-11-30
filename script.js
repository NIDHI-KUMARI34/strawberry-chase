const game = document.getElementById("game");
const basket = document.getElementById("basket");
const scoreDisplay = document.getElementById("score");
const pauseBtn = document.getElementById("pauseBtn");
const volumeControl = document.getElementById("volume");

// Audio elements
const catchSound = document.getElementById("catch-sound");
const missSound = document.getElementById("miss-sound");
const bgMusic = document.getElementById("bg-music");

let score = 0;
let misses = 0;
let paused = false;
let strawberryInterval;

// 👇 Background music fix — wait for user interaction
window.addEventListener("click", () => {
  bgMusic.volume = volumeControl.value;
  catchSound.volume = volumeControl.value;
  missSound.volume = volumeControl.value;

  bgMusic.play().catch(() => {
    console.log("Autoplay blocked again.");
  });
}, { once: true }); // only on first click

// Volume control slider
volumeControl.addEventListener("input", function () {
  const vol = this.value;
  bgMusic.volume = vol;
  catchSound.volume = vol;
  missSound.volume = vol;
});

// Basket movement
document.addEventListener("keydown", (e) => {
  if (paused) return;
  let basketLeft = parseInt(window.getComputedStyle(basket).left);
  if (e.key === "ArrowLeft" && basketLeft > 0) {
    basket.style.left = basketLeft - 30 + "px";
  }
  if (e.key === "ArrowRight" && basketLeft < 300) {
    basket.style.left = basketLeft + 30 + "px";
  }
});

// Pause/Resume game
pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "▶️ Resume" : "⏸️ Pause";
  if (!paused) {
    strawberryInterval = setInterval(createStrawberry, 1200);
  } else {
    clearInterval(strawberryInterval);
  }
});

// Create and drop strawberry
function createStrawberry() {
  if (paused) return;

  const strawberry = document.createElement("img");
  strawberry.src = "images/strawberry.png";
  strawberry.classList.add("strawberry");
  strawberry.style.left = Math.floor(Math.random() * 350) + "px";
  game.appendChild(strawberry);

  let topPosition = 0;
  const fallInterval = setInterval(() => {
    if (paused) return;
    topPosition += 4;
    strawberry.style.top = topPosition + "px";

    const basketLeft = parseInt(window.getComputedStyle(basket).left);
    const strawberryLeft = parseInt(strawberry.style.left);

    // If caught
    if (topPosition > 430 && topPosition < 500) {
      if (strawberryLeft > basketLeft - 40 && strawberryLeft < basketLeft + 100) {
        score++;
        scoreDisplay.textContent = score;
        catchSound.play();
        game.removeChild(strawberry);
        clearInterval(fallInterval);
        return;
      }
    }

    // If missed
    if (topPosition > 500) {
      misses++;
      missSound.play();
      if (misses >= 15) {
        alert("😢 You missed 15 strawberries! Score reset.");
        score = 0;
        misses = 0;
        scoreDisplay.textContent = score;
      }
      game.removeChild(strawberry);
      clearInterval(fallInterval);
    }
  }, 20);
}

// Start game immediately
strawberryInterval = setInterval(createStrawberry, 1200);
