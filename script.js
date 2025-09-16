const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");

// Pelota
let ballRadius = 8;
let x, y, dx, dy;

// Paleta
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX;

// Controles
let rightPressed = false;
let leftPressed = false;

// Bloques
let brickRowCount;
let brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let bricks = [];

// Juego
let score;
let lives = 3;
let level = 1;
let gameRunning = true;

// Inicialización
function initLevel() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2 + level * 0.5;
  dy = -(2 + level * 0.5);
  paddleX = (canvas.width - paddleWidth) / 2;
  score = 0;
  brickRowCount = 2 + level; // aumenta filas según nivel

  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
  gameRunning = true;
  info.textContent = `Nivel ${level} - Vidas: ${lives}`;
}

// Controles
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

// Colisiones con bloques
function collisionDetection() {
  let totalBricks = brickRowCount * brickColumnCount;
  let brokenBricks = 0;

  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
        }
      } else {
        brokenBricks++;
      }
    }
  }

  if (brokenBricks === totalBricks) {
    gameRunning = false;
    level++;
    setTimeout(() => {
      alert(`¡Nivel ${level - 1} superado!`);
      initLevel();
      draw();
    }, 100);
  }
}

// Dibujar bloques
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#4d9fff";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Dibujar pelota
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ff4d4d";
  ctx.fill();
  ctx.closePath();
}

// Dibujar paleta
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

// Dibujar puntuación y vidas
function drawHUD() {
  ctx.font = "14px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Puntos: " + score, 8, 20);
  ctx.fillText("Vidas: " + lives, canvas.width - 65, 20);
}

// Juego principal
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawHUD();
  collisionDetection();

  // Rebote en paredes
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      gameRunning = false;
      if (lives <= 0) {
        setTimeout(() => {
          alert("¡Game Over!");
          document.location.reload();
        }, 100);
      } else {
        setTimeout(() => {
          initLevel();
          draw();
        }, 100);
      }
    }
  }

  x += dx;
  y += dy;

  // Movimiento de paleta
  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  if (gameRunning) requestAnimationFrame(draw);
}

// Iniciar primer nivel
initLevel();
draw();
