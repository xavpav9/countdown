const gameBoard = document.querySelector(".gameboard");
const right = document.querySelector(".right");
const smallRows = document.querySelectorAll(".small-row");
const largeRow = document.querySelector(".large-row");
const selection = document.querySelector(".selection");
const chosen = document.querySelector(".chosen");
const startBtn = document.querySelector(".start");
const solveBtn = document.querySelector(".solve-button");
const solveDisplay = document.querySelector(".solve-display");
const stopResetBtn = document.querySelector(".reset-stop");
const displayBoxes = [...document.querySelectorAll(".display-box")];
const INTERVAL = 200;
let target = "";

const display = [];
const rowValues = [];
let solutions = [];
let isChosen = false;
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
  const boxes = [...selection.querySelectorAll(".large-row > div, .small-row > div")];
  if (boxes.includes(evt.target) && ![...evt.target.classList].includes("selected") && display.length < 6) {
    evt.target.classList.add("selected");
    display.push(rowValues[boxes.indexOf(evt.target)]);
    displayValues();
  };
});

startBtn.addEventListener("click", evt => {
  if (display.length === 6) {
    randomiseTarget(0)
  };
});

stopResetBtn.addEventListener("click", evt => {
  if (display.length === 6 && stopResetBtn.textContent === "Stop") {
    isChosen = true;
    for (const box of displayBoxes) {
      target += box.textContent;
    };
    solveCountdown();
    stopResetBtn.textContent = "Reset";
  } else if (stopResetBtn.textContent === "Reset") {
    gameBoard.style.setProperty("--max-width", "40vw");
    right.style.display = "none";

    target = "";
    solution = [];

    while (display.pop() !== undefined);
    displayValues();

    assignNumbers();
    isChosen = false;

    const boxes = [...selection.querySelectorAll(".large-row > div, .small-row > div")];
    boxes.forEach(box => {
      box.classList.remove("hundred");
      box.classList.remove("selected");
    });

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
    } else {
      const h3one = document.createElement("h3");
      h3one.textContent = "Method 1";
      solveDisplay.appendChild(h3one);
      displaySolution(solutions[0]);

      if (solutions.length >= 4) {
        const hr = document.createElement("hr");
        solveDisplay.appendChild(hr);

        const h3two = document.createElement("h3");
        h3two.textContent = "Method 2";
        solveDisplay.appendChild(h3two);
        displaySolution(solutions.at(-1));
      };
      if (solutions.length >= 8) {
        const hr2 = document.createElement("hr");
        solveDisplay.appendChild(hr2);

        const h3three = document.createElement("h3");
        h3three.textContent = "Method 3";
        solveDisplay.appendChild(h3three);
        displaySolution(solutions.at(Math.round(solutions.length / 2, 0)));
      };
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
    } else chosenBoxes[i].textContent = "";
  };
};

function randomiseTarget(interval=0) {
  if (interval === -1) {
    for (let i = 0; i < 3; ++i) {
      displayBoxes[i].textContent = 0;
    }
  } else {
    setTimeout(() => {
      if (isChosen === false) {
        for (let i = 0; i < 3; ++i) {
          displayBoxes[i].textContent = Math.floor(Math.random() * 10);
        }
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

  return (currentValue === +target) ? true : false;
};

function displaySolution(solution) {
  let result = solution[0][0];
  let numbers = solution[0].slice(1);

  for (let i = 0; i < numbers.length; ++i) {
    const para = document.createElement("p");
    para.textContent += result;

    switch (solution[1][i]) {
      case 0:
        para.textContent += " + ";
        result += numbers[i]
        break;
      case 1:
        para.textContent += " - ";
        result -= numbers[i]
        break;
      case 2:
        para.textContent += " / ";
        result /= numbers[i]
        break;
      case 3:
        para.textContent += " x ";
        result *= numbers[i]
        break;
    };
    para.textContent += numbers[i] + " = " + result;
    solveDisplay.appendChild(para);
  };
};
