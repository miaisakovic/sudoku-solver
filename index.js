const squares = document.querySelectorAll(".square");
const numSquares = squares.length;

const numberBtns = document.querySelectorAll(".numbers > button");
const solveBtn = document.querySelector(".solve");
const undoBtn = document.querySelector(".undo");
const clearBtn = document.querySelector(".clear");

const popup = document.querySelector(".popup");
const cover = document.querySelector(".cover");
const closePopup = document.querySelector(".close-popup");

let board = [
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
];

for (let i = 0; i < numSquares; i++) {
  squares[i].addEventListener("click", (event) => {
    const prev = document.querySelector(".selected");
    prev.classList.remove("selected");

    // Check if the previously selected square contains a valid entry
    if (
      !prev.classList.contains("invalid") &&
      !isNaN(parseInt(prev.textContent))
    ) {
      prev.classList.add("filled");
    }

    event.currentTarget.classList.add("selected");
  });
}

function getCoordinates(squareClasses) {
  // Get the position of a square in the Sudoku grid
  const classes = Array.from(squareClasses);
  const row = classes.find((className) => className.includes("row")).slice(-1);
  const col = classes.find((className) => className.includes("col")).slice(-1);
  return [row, col];
}

function isValidRow(row, col, entry, pos) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] == entry && !(col == i)) {
      pos.push(row, i);
      return false;
    }
  }
  return true;
}

function isValidCol(row, col, entry, pos) {
  for (let i = 0; i < 9; i++) {
    if (board[i][col] == entry && !(row == i)) {
      pos.push(i, col);
      return false;
    }
  }
  return true;
}

function isValid3x3(row, col, entry, pos) {
  for (let i = 0; i < 3; i++) {
    const newRow = i + (row - (row % 3));
    for (let j = 0; j < 3; j++) {
      const newCol = j + (col - (col % 3));
      if (board[newRow][newCol] == entry && !(row == newRow && col == newCol)) {
        pos.push(newRow, newCol);
        return false;
      }
    }
  }
  return true;
}

function isValidEntry(row, col, entry, pos = []) {
  // Check that there are no repeating entries in the given row
  if (!isValidRow(row, col, entry, pos)) {
    return false;
  }

  // Check that there are no repeating entries in the given column
  if (!isValidCol(row, col, entry, pos)) {
    return false;
  }

  // Check that there are no repeating entries in the same 3x3 grid
  if (!isValid3x3(row, col, entry, pos)) {
    return false;
  }

  return true;
}

function invalidSquares(pos, num, isValid) {
  let otherPos = [];
  if (!isValid(pos[0], pos[1], num, otherPos)) {
    const invalidSquareClasses1 = document.querySelector(
      ".row-" + pos[0] + ".col-" + pos[1]
    ).classList;
    const invalidSquareClasses2 = document.querySelector(
      ".row-" + otherPos[0] + ".col-" + otherPos[1]
    ).classList;
    invalidSquareClasses1.add("invalid");
    invalidSquareClasses2.add("invalid");
    return true;
  }
  return false;
}

function isNowValid(row, col, entry, isValid) {
  // Check if removing the given entry results in another entry now being valid
  let otherPos = [];
  const status = isValid(row, col, entry, otherPos);
  if (!status) {
    const isOtherValid = isValidEntry(otherPos[0], otherPos[1], entry);
    if (isOtherValid) {
      const validSquareClasses = document.querySelector(
        ".row-" + otherPos[0] + ".col-" + otherPos[1]
      ).classList;
      validSquareClasses.remove("invalid");
      validSquareClasses.add("filled");
    }
  }
}

for (let i = 0; i < 9; i++) {
  numberBtns[i].addEventListener("click", (event) => {
    const num = event.currentTarget.textContent;
    document.querySelector(".selected > p").textContent = num;

    const selectedSquareClasses = document.querySelector(".selected").classList;
    const pos = getCoordinates(selectedSquareClasses);
    // Check if there is already a square with the same number in the same row
    const resultRow = invalidSquares(pos, num, isValidRow);

    // Check if there is already a square with the same number in the same column
    const resultCol = invalidSquares(pos, num, isValidCol);

    // Check if there is already a square with the same number in the same 3x3 grid
    const result3x3 = invalidSquares(pos, num, isValid3x3);

    // If the selected square previously contained an invalid entry,
    //   this new entry may be valid
    if (!resultRow && !resultCol && !result3x3) {
      selectedSquareClasses.remove("invalid");
    }

    // Check if this square's new entry results in other entries now being valid
    const prevEntry = board[pos[0]][pos[1]];
    board[pos[0]][pos[1]] = "";
    if (prevEntry !== num && prevEntry !== "") {
      isNowValid(pos[0], pos[1], prevEntry, isValidRow);

      isNowValid(pos[0], pos[1], prevEntry, isValidCol);

      isNowValid(pos[0], pos[1], prevEntry, isValid3x3);
    }

    board[pos[0]][pos[1]] = num;
  });
}

undoBtn.addEventListener("click", () => {
  document.querySelector(".selected > p").textContent = "";

  const selectedSquareClasses = document.querySelector(".selected").classList;
  selectedSquareClasses.remove("filled");
  selectedSquareClasses.remove("invalid");

  const pos = getCoordinates(selectedSquareClasses);
  const entry = board[pos[0]][pos[1]];
  board[pos[0]][pos[1]] = "";

  // After removing this entry, check if there are still invalid entries
  isNowValid(pos[0], pos[1], entry, isValidRow);

  isNowValid(pos[0], pos[1], entry, isValidCol);

  isNowValid(pos[0], pos[1], entry, isValid3x3);
});

clearBtn.addEventListener("click", () => {
  const invalidSquares = document.querySelectorAll(".invalid");
  const numInvalid = invalidSquares.length;
  for (let i = 0; i < numInvalid; i++) {
    invalidSquares[i].classList.remove("invalid");
  }

  const filledSquares = document.querySelectorAll(".filled");
  const numFilled = filledSquares.length;
  for (let i = 0; i < numFilled; i++) {
    filledSquares[i].classList.remove("filled");
  }

  for (let i = 0; i < numSquares; i++) {
    squares[i].innerHTML = "<p></p>";
  }

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      board[i][j] = "";
    }
  }
});

function solveSudoku() {
  // Find an empty square
  let row = -1;
  let col = -1;
  inner: for (let i = 0; i < 9; i++) {
    outer: for (let j = 0; j < 9; j++) {
      if (board[i][j] === "") {
        row = i;
        col = j;
        break inner;
      }
    }
  }

  // If there are no empty squares left
  if (row === -1 && col === -1) {
    return true;
  }

  for (let entry = 1; entry < 10; entry++) {
    // Check if this entry is valid
    if (isValidEntry(row, col, entry)) {
      board[row][col] = entry.toString();
      if (solveSudoku()) {
        return true;
      } else {
        board[row][col] = "";
      }
    }
  }
  return false;
}

solveBtn.addEventListener("click", () => {
  if (document.querySelector(".invalid") == null && solveSudoku()) {
    // Display the result on the board
    for (let i = 0; i < numSquares; i++) {
      const pos = getCoordinates(squares[i].classList);
      squares[i].innerHTML = "<p>" + board[pos[0]][pos[1]] + "</p>";
    }
  } else {
    // Display a popup, which states that no solution exists
    popup.classList.add("active-popup");
    cover.classList.add("active-cover");
  }
});

closePopup.addEventListener("click", () => {
  popup.classList.remove("active-popup");
  cover.classList.remove("active-cover");
});
