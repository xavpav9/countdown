const gameBoard = document.querySelector(".gameboard");
const displaySelection = document.querySelector(".display-selection");
const right = document.querySelector(".right");
const smallRows = document.querySelectorAll(".small-row");
const largeRow = document.querySelector(".large-row");
const selection = document.querySelector(".selection");
const chosen = document.querySelector(".chosen");
const startBtn = document.querySelector(".start");
const solveBtn = document.querySelector(".solve-button");
const customBtn = document.querySelector(".custom");
const solveDisplay = document.querySelector(".solve-display");
const stopResetBtn = document.querySelector(".reset-stop");
const displayBoxes = [...document.querySelectorAll(".display-box")];
const INTERVAL = 200;
let target = "";
const boxes = [...selection.querySelectorAll(".large-row > div, .small-row > div")];
const displaySelectionBoxes = [...displaySelection.querySelectorAll("div")];

const display = [];
let rowValues = [];
let solutions = [];
let closestSolution = [];
let closestValue = 10000;
let isChosen = false;
custom = false;
assignNumbers();

const possibleOperations = [];
for (let l = 0; l < 6; ++l) {
  possibleOperations[l] = [];
  let operators = [];
  for (let i = 0; i < l; ++i) operators.push(0);
  possibleOperations[l].push(operators);


  for (let i = 1; i < Math.pow(4, l); ++i) {
    operators = [...operators];
    for (let o = 0; o < l; ++o) {
      operators[l-1-o] += 1;
      if (operators[l-1-o] !== 4) break;
      else  operators[l-1-o] = 0;
    };
    possibleOperations[l].push(operators);
  };
}

const possibleNumbers = [];
for (let l = 0; l < 6; ++l) {
  possibleNumbers[l] = [];
  let numbers = [];
  for (let i = 0; i < l + 1; ++i) numbers.push(0);
  if (l === 0) possibleNumbers[l].push(numbers);


  mainLoop: for (let i = 1; i < Math.pow(6, l + 1); ++i) {
    numbers = [...numbers];
    for (let o = 0; o < l + 1; ++o) {
      numbers[l-o] += 1;
      if (numbers[l-o] !== 6) break;
      else  numbers[l-o] = 0;
    };
    const seen = [];
    for (const number of numbers) {
      if (seen.includes(number)) continue mainLoop;
      else seen.push(number);
    };
    possibleNumbers[l].push(numbers);
  };
}

selection.addEventListener("click", evt => {
  if (boxes.includes(evt.target) && ![...evt.target.classList].includes("selected") && display.length < 6) {
    evt.target.classList.add("selected");
    display.push(rowValues[boxes.indexOf(evt.target)]);
    displayValues();
  };
});

startBtn.addEventListener("click", evt => {
  if (display.length === 6 && !custom) {
    randomiseTarget(0)
  } else if (target.length === 3 && display.length === 6 && custom) {
    isChosen = true;
    solveCountdown();
    stopResetBtn.textContent = "Reset";
  };
});

displaySelection.addEventListener("click", evt => {
  if (displaySelectionBoxes.includes(evt.target) && target.length < 3) {
    target += evt.target.textContent;
    for (let i = 0; i < 3; ++i) {
      if (target[i] !== undefined) displayBoxes[i].textContent = target[i];
    };
  };
});

stopResetBtn.addEventListener("click", evt => {
  if (display.length === 6 && stopResetBtn.textContent === "Stop" && target !== "" && !custom) {
    isChosen = true;
    solveCountdown();
    stopResetBtn.textContent = "Reset";
  } else if (stopResetBtn.textContent === "Reset") {
    gameBoard.style.setProperty("--max-width", "40vw");
    right.style.display = "none";

    target = "";
    solutions = [];
    closestSolution = [];
    closestValue = 10000;

    while (display.pop() !== undefined);
    displayValues();

    if (!custom) assignNumbers();
    isChosen = false;

    boxes.forEach(box => box.classList.remove("selected"));

    const chosenBoxes = [...chosen.querySelectorAll("div")];
    chosenBoxes.forEach(box => box.classList.remove("hundred"));

    [...solveDisplay.children].forEach(child => child.remove())

    randomiseTarget(-1);
    stopResetBtn.textContent = "Stop";
  };
});

solveBtn.addEventListener("click", evt => {
  if (display.length === 6 && stopResetBtn.textContent === "Reset" && solveDisplay.children.length === 0) {
    gameBoard.style.setProperty("--max-width", "80vw");
    right.style.display = "flex";

    if (solutions.length === 0) {
      const h3 = document.createElement("h3");
      h3.textContent = "No Solutions!";
      solveDisplay.appendChild(h3);

      const hr = document.createElement("hr");
      solveDisplay.appendChild(hr);

      const h3one = document.createElement("h3");
      h3one.textContent = "Closest Solution:";
      solveDisplay.appendChild(h3one);
      displaySolution(closestSolution);

      const hr2 = document.createElement("hr");
      solveDisplay.appendChild(hr2);

    } else {
      for (let i = 0; i < Math.floor(Math.sqrt(solutions.length)); ++i) {
        const h3one = document.createElement("h3");
        h3one.textContent = `Method ${i+1}`;
        solveDisplay.appendChild(h3one);
        displaySolution(solutions[i*Math.floor(Math.sqrt(solutions.length))]);

        const hr = document.createElement("hr");
        solveDisplay.appendChild(hr);
      };
    };
  };
});

customBtn.addEventListener("click", evt => {
  if (display.length === 0 && custom === false) {
    custom = true;
    displaySelection.style.display="flex";
    customBtn.classList.add("active");
    assignNumbers(0);

    for (let i = 0; i < boxes.length; ++i) {
        boxes[i].textContent = rowValues[i];
    };
    boxes[3].classList.add("hundred");
  } else if (display.length === 0 && custom === true && target.length === 0) {
    custom = false;
    displaySelection.style.display="none";
    customBtn.classList.remove("active");
    assignNumbers();

    for (let i = 0; i < boxes.length; ++i) {
        boxes[i].textContent = "";
    };
    boxes[3].classList.remove("hundred");
  };
});

function assignNumbers(option=1) {
  const smallOptions = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]
  const largeOptions = [25,50,75,100]
  if (option === 1) {
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
  } else if (option === 0) {
    rowValues = largeOptions.concat(smallOptions);
  };
};

function displayValues() {
  const chosenBoxes = [...chosen.querySelectorAll("div")];
  for (let i = 0; i < 6; ++i) {
    if (display[i] !== undefined) {
      chosenBoxes[i].textContent = display[i];
      if (display[i] === 100) chosenBoxes[i].classList.add("hundred");
    } else chosenBoxes[i].textContent = "";
  };
};

function randomiseTarget(interval=0) {
  if (interval === -1) {
    for (let i = 0; i < 3; ++i) {
      displayBoxes[i].textContent = "";
    }
  } else {
    setTimeout(() => {
      if (isChosen === false) {
        displayBoxes[0].textContent = Math.floor(Math.random() * 9 + 1);
        displayBoxes[1].textContent = Math.floor(Math.random() * 10);
        displayBoxes[2].textContent = Math.floor(Math.random() * 10);

        target=""
        for (const box of displayBoxes) {
          target += box.textContent;
        };

        randomiseTarget(INTERVAL);
      };
    }, interval)
  };
}

function solveCountdown() {
  for (const arrOfArrs of possibleNumbers) {
    for (const arr of arrOfArrs) {
      for (const operators of possibleOperations[arr.length - 1]) {
        if (checkSolve(arr, operators)) solutions.push([arr, operators]);
      };
    };
  };
  solutions.sort((a,b) => b[0].length - a[0].length);
};

function count(arr, num) {
  return arr.reduce((acc, item) => {
    return (num === item) ? acc + 1 : acc;
  }, 0);
};

function checkSolve(arr, operators) {
  let currentValue = display[arr[0]];
  const newArr = arr.slice(1);
  for (let i = 0; i < arr.length; ++i) {
    switch (operators[i]) {
      case 0:
        currentValue += display[newArr[i]];
        break;
      case 1:
        currentValue -= display[newArr[i]];
        break;
      case 2:
        currentValue /= display[newArr[i]];
        break;
      case 3:
        currentValue *= display[newArr[i]];
        break;
    };
  };
  if (Math.abs(closestValue - +target) > Math.abs(currentValue - +target)) {
    closestSolution = [arr, operators];
    closestValue = currentValue;
  };
  return (currentValue === +target) ? true : false;
};

function displaySolution(solution) {
  let result = display[solution[0][0]];
  let numbers = solution[0].slice(1);

  for (let i = 0; i < numbers.length; ++i) {
    const para = document.createElement("p");
    para.textContent += (Math.round(result * 100) / 100);

    switch (solution[1][i]) {
      case 0:
        para.textContent += " + ";
        result += display[numbers[i]];
        break;
      case 1:
        para.textContent += " - ";
        result -= display[numbers[i]];
        break;
      case 2:
        para.textContent += " / ";
        result /= display[numbers[i]];
        break;
      case 3:
        para.textContent += " x ";
        result *= display[numbers[i]];
        break;
    };
    para.textContent += display[numbers[i]] + " = " + (Math.round(result * 100) / 100);
    solveDisplay.appendChild(para);
  };
};
