const gameContainer = document.getElementById("game");

const currentCards = [];
let pairsMatched = 0;
let score = 0;

let COLORS = createColorsArray();
let shuffledColors = shuffle(COLORS);

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256); 
  return `rgb(${r}, ${g}, ${b})`; 
}

function createColorsArray() {
  const colorsArr = [];
  for (let i = 0; i < 5; i++) {
    const randomColor = getRandomColor();
    colorsArr.push(randomColor);
    colorsArr.push(randomColor);    
  }
  return colorsArr;
};

function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;

    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function createDivsForColors(colorArray) {
  const scoreEl = document.createElement('section');
  scoreEl.innerText = score;
  scoreEl.id = 'score';
  gameContainer.appendChild(scoreEl);

  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add('color-div');
    newDiv.dataset.color = color;
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

function updateScore() {
  score++;
  const scoreEl = document.getElementById('score');
  scoreEl.innerText = score;
}

function showCompleted() {
  const completedEl = document.createElement('section');
  const spanEl = document.createElement('span');
  spanEl.innerText = `YOU WIN! Click "Restart" to play again!`;
  completedEl.appendChild(spanEl);

  const restartBtnEl = document.createElement('button');
  restartBtnEl.classList.add('restart-btn');
  restartBtnEl.innerText = 'Restart';
  completedEl.appendChild(restartBtnEl);

  gameContainer.appendChild(completedEl);
};

function setBestScore() {
  const currentBestScore = JSON.parse(localStorage.getItem('bestScore'));
  if (currentBestScore) {
    if (score < currentBestScore) {
      localStorage.setItem('bestScore', JSON.stringify(score));
    }
  } else {
    localStorage.setItem('bestScore', JSON.stringify(score));
  };
}

function getBestScore() {
  let currentBestScore = JSON.parse(localStorage.getItem('bestScore'));
  if (!currentBestScore) { 
    currentBestScore = '--';
  };

  return currentBestScore;
}

function resetGame() {
  gameContainer.innerHTML = '';
  score = 0;
  pairsMatched = 0;
  loadStartPage();
};

function loadGamePage() {
  gameContainer.innerHTML = '';
  COLORS = createColorsArray();
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
}

function loadStartPage() {
  const h2 = document.createElement('h2');
  h2.innerText = `Press "Start" to begin!`;
  const startBtn = document.createElement('button');
  startBtn.innerText = 'Start';
  startBtn.id = 'start-btn';

  const currentBestScore = getBestScore();
  const h3 = document.createElement('h3');
  h3.id = 'best-score';
  h3.innerText = `Best Score: ${currentBestScore}`;

  gameContainer.appendChild(h2);
  gameContainer.appendChild(startBtn);
  gameContainer.appendChild(h3);

  startBtn.addEventListener('click', loadGamePage);
}

// TODO: Implement this function!
function handleCardClick(event) {
  // make sure no more than 2 cards are in play at the same time
  if (currentCards.length === 2) return;

  // check if the same card is clicked
  if (currentCards.length === 1){
    if (currentCards[0].element === event.target) {
      return;
    }
  };

  // add current clicked card to array
  const currentCardEl = event.target;
  const currentCardColor = currentCardEl.dataset.color;
  event.target.style.backgroundColor = currentCardColor;
  currentCards.push({
    color: currentCardColor,
    element: currentCardEl
  });

  updateScore();

  // conditions when array length reaches two
  if (currentCards.length === 2) {
    if (currentCards[0].color === currentCards[1].color) {
      for (const card of currentCards) {
        card.element.style.pointerEvents = 'none';
      }
      currentCards.length = 0;
      pairsMatched++; 
      
      if (pairsMatched === 5) {
        showCompleted();
        setBestScore();
        const restartBtn = document.querySelector('.restart-btn');
        restartBtn.addEventListener('click', resetGame);
      }
      return;
    } else {      
      setTimeout(() => {
        for (const card of currentCards) {
          card.element.style.backgroundColor = 'transparent';
        }
        currentCards.length = 0;
      }, 1000);
    }
  }; 
}

// when the DOM loads
loadStartPage();
