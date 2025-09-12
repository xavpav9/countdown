const gameBoard = document.querySelector(".gameboard");
const smallRows = document.querySelectorAll(".small-row");
const largeRow = document.querySelector(".large-row");
const selection = document.querySelector(".selection");
const chosen = document.querySelector(".chosen");
const startBtn = document.querySelector(".start");
const stopResetBtn = document.querySelector(".reset-stop");
const displayBoxes = [...document.querySelectorAll(".display-box")];
const INTERVAL = 400;
let target = "";

const display = [];
const rowValues = [];
let isChosen = false;
assignNumbers();

selection.addEventListener("click", evt => {
  const boxes = [...selection.querySelectorAll(".large-row > div, .small-row > div")];
  if (boxes.includes(evt.target) && ![...evt.target.classList].includes("selected") && display.length < 6) {
    evt.target.classList.add("selected");
    display.push(rowValues[boxes.indexOf(evt.target)]);
    displayValues();
  };
});

startBtn.addEventListener("click", evt => {
  if (display.length === 6) {
    randomiseTarget()
  }
});

stopResetBtn.addEventListener("click", evt => {
  if (display.length === 6 && stopResetBtn.textContent === "Stop") {
    isChosen = true;
    setTimeout(() => {isChosen = false}, INTERVAL + 1);
    for (const box of displayBoxes) {
      target += box.textContent;
    };
  };
});

function assignNumbers() {
  const smallOptions = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]
  const largeOptions = [25,50,75,100]
  for (let i = 4; i < 24; ++i) {
    index = Math.floor(Math.random() * smallOptions.length);
    rowValues[i] = smallOptions[index];
    smallOptions.splice(index, 1)
  };

  for (let i = 0; i < 4; ++i) {
    index = Math.floor(Math.random() * largeOptions.length);
    rowValues[i] = largeOptions[index];
    largeOptions.splice(index, 1)
  };
};

function displayValues() {
  const chosenBoxes = [...chosen.querySelectorAll("div")];
  for (let i = 0; i < 6; ++i) {
    if (display[i] !== undefined) {
      chosenBoxes[i].textContent = display[i];
      if (display[i] === 100) chosenBoxes[i].classList.add("hundred");
    } else break;
  };
};

function randomiseTarget() {
  setTimeout(() => {
    if (isChosen === false) {
      for (let i = 0; i < 3; ++i) {
        displayBoxes[i].textContent = Math.floor(Math.random() * 10);
      }
      randomiseTarget();
    };
  }, INTERVAL)
}

