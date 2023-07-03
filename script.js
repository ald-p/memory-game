const gameContainer = document.getElementById("game");
const startBtn = document.getElementById("start-btn");

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

const currentCards = [];
let pairsMatched = 0;
let score = 0;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  // score element
  const scoreEl = document.createElement('section');
  scoreEl.innerText = score;
  scoreEl.id = 'score';
  gameContainer.appendChild(scoreEl);

  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
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

        completedEl.addEventListener('click', function() {
          gameContainer.innerHTML = '';
          createDivsForColors(shuffledColors);
        })
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
startBtn.addEventListener('click', function() {
  gameContainer.innerHTML = '';
  createDivsForColors(shuffledColors);
});
