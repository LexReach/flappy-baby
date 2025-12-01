const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let babyImg = new Image();
babyImg.src = "assets/baby.png";

let baby = {
  x: 80,
  y: canvas.height / 2,
  width: 150,
  height: 65,
  gravity: 0.35,
  lift: -7.5,
  velocity: 0
};

let pipes = [];
let score = 0;
let gameOver = false;

function resetGame() {
  baby.y = canvas.height / 2;
  baby.velocity = 0;
  score = 0;
  pipes = [];
  gameOver = false;
}

function drawBaby() {
  ctx.drawImage(babyImg, baby.x, baby.y, baby.width, baby.height);
}

function createPipe() {
  let gap = 180;
  let top = Math.random() * (canvas.height - gap - 100);
  pipes.push({
    x: canvas.width,
    top,
    bottom: top + gap,
    width: 80
  });
}

setInterval(createPipe, 2000);

function drawPipes() {
  ctx.fillStyle = "#FFC0CB"; // baby pink pipes
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, p.bottom, p.width, canvas.height - p.bottom);
  });
}

function update() {
  if (gameOver) return;

  baby.velocity += baby.gravity;
  baby.y += baby.velocity;

  if (baby.y + baby.height >= canvas.height || baby.y <= 0) {
    gameOver = true;
  }

  pipes.forEach(p => {
    p.x -= 3;

    if (
      baby.x < p.x + p.width &&
      baby.x + baby.width > p.x &&
      (baby.y < p.top || baby.y + baby.height > p.bottom)
    ) {
      gameOver = true;
    }

    if (p.x + p.width < baby.x && !p.scored) {
      score++;
      p.scored = true;
    }
  });

  pipes = pipes.filter(p => p.x + p.width > 0);

  draw();
  requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBaby();
  drawPipes();

  ctx.fillStyle = "white";
  ctx.font = "40px sans-serif";
  ctx.fillText(score, 20, 60);

  if (gameOver) {
    ctx.font = "60px sans-serif";
    ctx.fillText("😭 Game Over", 40, canvas.height / 2);
  }
}

canvas.addEventListener("touchstart", () => {
  baby.velocity = baby.lift;
  if (gameOver) resetGame();
});

babyImg.onload = update;
