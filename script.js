const gameContainer = document.getElementById("game");
const startBtn = document.getElementById("start-btn");

const currentCards = [];
let pairsMatched = 0;
let score = 0;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

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

let shuffledColors = shuffle(COLORS);

function createDivsForColors(colorArray) {
  const scoreEl = document.createElement('section');
  scoreEl.innerText = score;
  scoreEl.id = 'score';
  gameContainer.appendChild(scoreEl);

  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(color);
    newDiv.addEventListener("click", handleCardClick);
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  if (currentCards.length === 2) {
    return;
  }

  const cardColor = event.target.classList[0];
  event.target.style.backgroundColor = cardColor;
  currentCards.push({
    color: cardColor,
    element: event.target
  });

  score++;
  const scoreEl = document.getElementById('score');
  scoreEl.innerText = score;

  if (currentCards.length === 2) {
    if (currentCards[0].element === currentCards[1].element) {
      currentCards.splice(currentCards[1], 1);
      return;
    };

    if (currentCards[0].color === currentCards[1].color) {
      for (const card of currentCards) {
        card.element.style.pointerEvents = 'none';
      }
      currentCards.length = 0;
      pairsMatched++; 
      
      if (pairsMatched === 5) {
        const completedEl = document.createElement('section');
        const spanEl = document.createElement('span');
        spanEl.innerText = `YOU FINISHED! Click "Restart" to play again!`;
        completedEl.appendChild(spanEl);

        const restartBtnEl = document.createElement('button');
        restartBtnEl.innerText = 'Restart';
        completedEl.appendChild(restartBtnEl);

        gameContainer.appendChild(completedEl);

        // check score
        const currentBestScore = JSON.parse(localStorage.getItem('bestScore'));
        if (currentBestScore) {
          if (score < currentBestScore) {
            localStorage.setItem('bestScore', JSON.stringify(score));
          }
        } else {
          localStorage.setItem('bestScore', JSON.stringify(score));
        };

        restartBtnEl.addEventListener('click', function() {
          gameContainer.innerHTML = '';
          score = 0;
          pairsMatched = 0;
          shuffledColors = shuffle(COLORS);
          createDivsForColors(shuffledColors);
        })
      }
      return;
    } else {
      score++;
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
startBtn.addEventListener('click', function() {
  gameContainer.innerHTML = '';
  createDivsForColors(shuffledColors);
});
