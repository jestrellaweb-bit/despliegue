let scoreRed = 0;
let scoreBlue = 0;
let timerInterval;
let timeLeft = 180; // 3 minutos
let running = false;

function addPoint(fighter) {
  if (fighter === "red") {
    scoreRed++;
    document.getElementById("scoreRed").textContent = scoreRed;
  } else {
    scoreBlue++;
    document.getElementById("scoreBlue").textContent = scoreBlue;
  }
}

function updateTimer() {
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');
  document.getElementById("timer").textContent = `${minutes}:${seconds}`;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    running = false;
  } else {
    timeLeft--;
  }
}

function toggleTimer() {
  if (!running) {
    running = true;
    timerInterval = setInterval(updateTimer, 1000);
  } else {
    running = false;
    clearInterval(timerInterval);
  }
}
