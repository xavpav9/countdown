const gameBoard = document.querySelector(".gameboard");
const smallRows = document.querySelectorAll(".small-row");
const largeRow = document.querySelector(".large-row");
const selection = document.querySelector(".selection");

const smallRowsValues = []
const largeRowValues = []

function assignNumbers() {
  const smallOptions = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]
  const largeOptions = [25,50,75,100]
  for (let i = 0; i < 20; ++i) {
    index = Math.floor(Math.random() * smallOptions.length);
    smallRowsValues[i] = smallOptions[index];
    smallOptions.splice(index, 1)
  }

  for (let i = 0; i < 4; ++i) {
    index = Math.floor(Math.random() * largeOptions.length);
    largeRowValues[i] = largeOptions[index];
    largeOptions.splice(index, 1)
  }
}

selection.addEventListener("click", evt => {
  if ([...selection.querySelectorAll(".large-row > div, .small-row > div")].includes(evt.target)) {
    evt.target.classList.add("selected");
  }
});

