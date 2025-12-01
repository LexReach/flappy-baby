const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//
// IMAGES
//
let babyImg = new Image();
babyImg.src = "assets/baby.png";

let gameOverImg = new Image();
gameOverImg.src = "assets/gameover.png"; // <-- MAKE SURE THIS FILE EXISTS

//
// BABY OBJECT
//
let baby = {
  x: 80,
  y: canvas.height / 2,
  width: 150,
  height: 65,
  gravity: 0.35,
  lift: -7.5,
  velocity: 0
};

//
// GAME STATE
//
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

//
// PIPE GENERATION
//
function createPipe() {
  let gap = 180;
  let top = Math.random() * (canvas.height - gap - 100);
  pipes.push({
    x: canvas.width,
    top,
    bottom: top + gap,
    width: 80,
    scored: false
  });
}

setInterval(createPipe, 2000);

//
// DRAW FUNCTIONS
//
function drawBaby() {
  ctx.drawImage(babyImg, baby.x, baby.y, baby.width, baby.height);
}

function drawPipes() {
  ctx.fillStyle = "#FFC0CB"; // baby pink
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, p.bottom, p.width, canvas.height - p.bottom);
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "40px sans-serif";
  ctx.fillText(score, 20, 60);
}

function drawGameOverImage() {
  const imgWidth = 350;
  const imgHeight = 250;
  const x = (canvas.width - imgWidth) / 2;
  const y = (canvas.height - imgHeight) / 2;

  ctx.drawImage(gameOverImg, x, y, imgWidth, imgHeight);
}

//
// UPDATE LOOP
//
function update() {
  if (!gameOver) {
    baby.velocity += baby.gravity;
    baby.y += baby.velocity;

    if (baby.y + baby.height > canvas.height || baby.y < 0) {
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
  }

  draw();
  requestAnimationFrame(update);
}

//
// RENDER
//
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBaby();
  drawPipes();
  drawScore();

  if (gameOver) {
    drawGameOverImage();
  }
}

//
// INPUT HANDLING
//
canvas.addEventListener("touchstart", () => {
  if (gameOver) {
    resetGame();
  } else {
    baby.velocity = baby.lift;
  }
});

//
// START GAME
//
babyImg.onload = update;
