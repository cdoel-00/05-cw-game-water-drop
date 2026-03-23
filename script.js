// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timerCounter; // Stores the countdown interval
let timeLeft = 30;
let score = 0;

const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const gameOverModal = document.getElementById("game-over-modal");
const encouragingMessageDisplay = document.getElementById("encouraging-message");
const charityFactDisplay = document.getElementById("charity-fact");
const finalScoreDisplay = document.getElementById("final-score");
const playAgainButton = document.getElementById("play-again-btn");

const successMessages = ["Good job!", "Nice catch!", "Awesome!", "Great work!"];
const badDropMessages = ["Avoid bad drops!", "Oops! Skip the red drops!", "Careful - bad drop!"];
const endMessages = [
  "You made a real impact today!",
  "Excellent work, every drop counts!",
  "Amazing effort, keep going!",
  "Great game, your catches matter!",
];
const charityWaterFacts = [
  "100% of public donations to charity: water fund clean water projects.",
  "charity: water has funded over 150,000 water projects around the world.",
  "Clean water can help improve health, education, and family income in communities.",
  "charity: water uses GPS and photos to help track many completed projects.",
];

// Wait for button click to start the game
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", () => {
  hideGameOverPopup();
  startGame();
});

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  gameContainer.innerHTML = "";
  hideGameOverPopup();
  startButton.disabled = true;
  startButton.textContent = "Game Running...";

  // Create new drops every second (1000 milliseconds)
  dropMaker = setInterval(createDrop, 1000);

  // Countdown from 30 seconds and stop game at 0
  timerCounter = setInterval(() => {
    timeLeft -= 1;
    timeDisplay.textContent = Math.max(timeLeft, 0);

    if (timeLeft <= 0) {
      endGame();
      showGameOverPopup();
    }
  }, 1000);
}

function endGame() {
  clearInterval(dropMaker);
  clearInterval(timerCounter);
  gameRunning = false;
  startButton.disabled = false;
  startButton.textContent = "Start Game";
  gameContainer.querySelectorAll(".water-drop").forEach((drop) => drop.remove());
}

function resetGame() {
  clearInterval(dropMaker);
  clearInterval(timerCounter);
  gameRunning = false;
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  hideGameOverPopup();
  startButton.disabled = false;
  startButton.textContent = "Start Game";
  gameContainer.querySelectorAll(".water-drop").forEach((drop) => drop.remove());
}

function showGameOverPopup() {
  const message = endMessages[Math.floor(Math.random() * endMessages.length)];
  const fact = charityWaterFacts[Math.floor(Math.random() * charityWaterFacts.length)];

  encouragingMessageDisplay.textContent = message;
  charityFactDisplay.textContent = fact;
  finalScoreDisplay.textContent = score;
  gameOverModal.classList.remove("modal-hidden");
}

function hideGameOverPopup() {
  gameOverModal.classList.add("modal-hidden");
}

function createDrop() {
  if (!gameRunning) return;

  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";
  const isBadDrop = Math.random() < 0.25;
  if (isBadDrop) {
    drop.classList.add("bad-drop");
  }

  // Make drops different sizes for visual variety
  const initialSize = 80;
  const sizeMultiplier = Math.random() * 0.6 + 0.8;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  // Subtract 60 pixels to keep drops fully inside the container
  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - size);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  gameContainer.appendChild(drop);

  // Handle successful clicks: burst animation, score, and feedback text
  drop.addEventListener(
    "click",
    () => {
      if (!gameRunning) return;

      if (isBadDrop) {
        score -= 1;
        showBadDropMessage(drop);
      } else {
        score += 1;
        showSuccessMessage(drop);
        showConfetti(drop);
      }

      scoreDisplay.textContent = score;

      drop.classList.add("burst");
      setTimeout(() => {
        drop.remove();
      }, 220);
    },
    { once: true }
  );

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}

function showSuccessMessage(drop) {
  const randomMessage =
    successMessages[Math.floor(Math.random() * successMessages.length)];
  showFloatingMessage(drop, randomMessage);
}

function showBadDropMessage(drop) {
  const randomMessage =
    badDropMessages[Math.floor(Math.random() * badDropMessages.length)];
  showFloatingMessage(drop, randomMessage, "bad-warning");
}

function showFloatingMessage(drop, text, variantClass = "") {
  const message = document.createElement("div");
  message.className = `catch-message ${variantClass}`.trim();
  message.textContent = text;

  const dropBox = drop.getBoundingClientRect();
  const gameBox = gameContainer.getBoundingClientRect();

  message.style.left = `${dropBox.left - gameBox.left + dropBox.width / 2}px`;
  message.style.top = `${dropBox.top - gameBox.top}px`;

  gameContainer.appendChild(message);

  message.addEventListener("animationend", () => {
    message.remove();
  });
}

function showConfetti(drop) {
  const confettiColors = ["#FFC907", "#2E9DF7", "#4FCB53", "#FF902A", "#F16061"];
  const dropBox = drop.getBoundingClientRect();
  const gameBox = gameContainer.getBoundingClientRect();
  const originX = dropBox.left - gameBox.left + dropBox.width / 2;
  const originY = dropBox.top - gameBox.top + dropBox.height / 2;

  for (let i = 0; i < 16; i += 1) {
    const piece = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 35 + Math.random() * 65;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    piece.className = "confetti-piece";
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    piece.style.setProperty("--dx", `${dx.toFixed(2)}px`);
    piece.style.setProperty("--dy", `${dy.toFixed(2)}px`);
    piece.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;

    gameContainer.appendChild(piece);

    piece.addEventListener("animationend", () => {
      piece.remove();
    });
  }
}
