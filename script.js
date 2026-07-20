const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const holes = Array.from(document.querySelectorAll('.hole'));

let score = 0;
let timeLeft = 30;
let gameActive = false;
let countdownTimer;
let moleSpawnTimer;
let moleDisappearTimer;
let activeHole = null;

function setMessage(text) {
  messageDisplay.textContent = text;
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function updateTime() {
  timeDisplay.textContent = timeLeft;
}

function clearActiveMole() {
  if (activeHole) {
    activeHole.querySelector('.mole')?.remove();
    activeHole = null;
  }
}

function showMole() {
  clearActiveMole();
  if (!gameActive) return;

  const randomIndex = Math.floor(Math.random() * holes.length);
  const chosenHole = holes[randomIndex];
  activeHole = chosenHole;

  const mole = document.createElement('div');
  mole.className = 'mole';
  chosenHole.appendChild(mole);

  clearTimeout(moleDisappearTimer);
  moleDisappearTimer = setTimeout(() => {
    if (activeHole === chosenHole) {
      clearActiveMole();
      setMessage('Too slow!');
    }
  }, 700);
}

function startGame() {
  if (gameActive) return;

  score = 0;
  timeLeft = 30;
  gameActive = true;
  updateScore();
  updateTime();
  startBtn.disabled = true;
  restartBtn.disabled = false;
  setMessage('Game started! Hit the mole with Space.');
  clearActiveMole();

  showMole();

  countdownTimer = setInterval(() => {
    timeLeft -= 1;
    updateTime();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  moleSpawnTimer = setInterval(() => {
    showMole();
  }, 900);
}

function endGame() {
  gameActive = false;
  clearInterval(countdownTimer);
  clearInterval(moleSpawnTimer);
  clearTimeout(moleDisappearTimer);
  clearActiveMole();
  startBtn.disabled = false;
  restartBtn.disabled = false;
  setMessage(`Time is up! Final score: ${score}`);
}

function restartGame() {
  endGame();
  startGame();
}

function hitMole() {
  if (!gameActive || !activeHole) return;

  const activeMole = activeHole.querySelector('.mole');
  if (!activeMole) return;

  score += 1;
  updateScore();
  activeMole.remove();
  activeHole = null;
  setMessage('Nice hit!');
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

holes.forEach((hole) => {
  hole.addEventListener('click', () => {
    if (gameActive) {
      hitMole();
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    hitMole();
  }
});
