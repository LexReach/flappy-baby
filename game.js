const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

//
// LOAD IMAGES
//
let babyImg = new Image();
babyImg.src = "assets/baby.png";

let millieImg = new Image();
millieImg.src = "assets/millie.png";

let gameOverImg = new Image();
gameOverImg.src = "assets/gameover.png";

//
// BABY SETTINGS
//
let baby = {
  x: 80,
  y: canvas.height / 2,
  width: 150,
  height: 65,
  velocity: 0,
  gravity: 0.38,
  lift: -8
};

//
// GAME STATE
//
let pipes = [];
let score = 0;
let gameOver = false;

//
// RESET GAME
//
function resetGame() {
  baby.y = canvas.height / 2;
  baby.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
}

//
// CREATE DIAPER OBSTACLES
//
function createPipe() {
  let gap = 200; // space between diaper towers
  let top = Math.random() * (canvas.height - gap - 200);

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
// DRAW BABY
//
function drawBaby() {
  ctx.drawImage(babyImg, baby.x, baby.y, baby.width, baby.height);
}

//
// DRAW DIAPER TOWERS
//
function drawPipes() {
  pipes.forEach(p => {
    // top stack
    ctx.drawImage(millieImg, p.x, 0, p.width, p.top);

    // bottom stack
    ctx.drawImage(
      millieImg,
      p.x,
      p.bottom,
      p.width,
      canvas.height - p.bottom
    );
  });
}

//
// DRAW SCORE
//
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "40px sans-serif";
  ctx.fillText(score, 20, 60);
}

//
// DRAW GAME OVER SCREEN
//
function drawGameOver() {
  const w = 350;
  const h = 250;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  ctx.drawImage(gameOverImg, x, y, w, h);
}

//
// UPDATE LOOP
//
function update() {
  if (!gameOver) {
    baby.velocity += baby.gravity;
    baby.y += baby.velocity;

    pipes.forEach(p => {
      p.x -= 3;

      // collision detection
      if (
        baby.x < p.x + p.width &&
        baby.x + baby.width > p.x &&
        (baby.y < p.top || baby.y + baby.height > p.bottom)
      ) {
        gameOver = true;
      }

      // passed obstacle
      if (p.x + p.width < baby.x && !p.scored) {
        score++;
        p.scored = true;
      }
    });

    // remove pipes off screen
    pipes = pipes.filter(p => p.x + p.width > 0);

    // hit floor/ceiling
    if (baby.y < 0 || baby.y + baby.height > canvas.height) {
      gameOver = true;
    }
  }

  draw();
  requestAnimationFrame(update);
}

//
// RENDER FRAME
//
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBaby();
  drawPipes();
  drawScore();

  if (gameOver) drawGameOver();
}

//
// PLAYER INPUT
//
canvas.addEventListener("touchstart", () => {
  if (gameOver) resetGame();
  else baby.velocity = baby.lift;
});

babyImg.onload = update;
