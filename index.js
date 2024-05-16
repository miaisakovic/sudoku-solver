const squares = document.querySelectorAll(".square");
const numSquares = squares.length;

const numberBtns = document.querySelectorAll(".numbers > button");
const solveBtn = document.querySelector("#solve");
const undoBtn = document.querySelector("#undo");
const clearBtn = document.querySelector("#clear");

const popup = document.querySelector(".popup"); 
const cover = document.querySelector(".cover")
const closePopup = document.querySelector("#close-popup");

var board = [["", "" , "", "", "", "", "", "", ""],
             ["", "" , "", "", "", "", "", "", ""],
             ["", "" , "", "", "", "", "", "", ""],
             ["", "" , "", "", "", "", "", "", ""],
             ["", "" , "", "", "", "", "", "", ""],
             ["", "" , "", "", "", "", "", "", ""],
             ["", "" , "", "", "", "", "", "", ""],
             ["", "" , "", "", "", "", "", "", ""],
             ["", "" , "", "", "", "", "", "", ""]];

for (var i = 0; i < numSquares; i++) {
    squares[i].addEventListener("click", function() {
        var prev = document.querySelector(".selected");
        prev.classList.remove("selected");

        if (prev.textContent != "") {
            prev.classList.add("filled");
        }

        this.classList.add("selected");
    })
}

function getCoordinates(classLst) {
    const classes = Array.from(classLst);
    const row = classes.find(name => name.includes("row")).slice(-1,);
    const col = classes.find(name => name.includes("col")).slice(-1,);
    return [row, col];
}

for (var i = 0; i < 9; i++) {
    numberBtns[i].addEventListener("click", function() {
        document.querySelector(".selected > p").textContent = this.textContent;
        const pos = getCoordinates(document.querySelector(".selected").classList);
        board[pos[0]][pos[1]] = this.textContent;
    })
}

undoBtn.addEventListener("click", function() {
    document.querySelector(".selected > p").textContent = "";
    const pos = getCoordinates(document.querySelector(".selected").classList);
    board[pos[0]][pos[1]] = "";
})

clearBtn.addEventListener("click", function() {
    const filledSquares = document.querySelectorAll(".filled");
    const numFilled = filledSquares.length;
    for (var i = 0; i < numFilled; i++) {
        filledSquares[i].classList.remove("filled");
    }

    for (var i = 0; i < numSquares; i++) {
        squares[i].innerHTML = "<p></p>";
    }

    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            board[i][j] = "";
        }
    }
})

solveBtn.addEventListener("click", function() {
    if (solveSudoku()) {
        // Display the result on the board
        for (var i = 0; i < numSquares; i++) {
            const pos = getCoordinates(squares[i].classList);
            squares[i].innerHTML = "<p>" + board[pos[0]][pos[1]] + "</p>";
        }
    } else {
        // Display a popup, which states that no solution exists
        popup.classList.add("active-popup");
        cover.classList.add("active-cover");
    }
});

closePopup.addEventListener("click", function() {
    popup.classList.remove("active-popup");
    cover.classList.remove("active-cover");
})

function isValidEntry(row, col, entry) {
    // Check that there are no duplicates in the row
    for (var i = 0; i < 9; i++) {
        if (board[row][i] == entry) {
            return false;
        }
    }

    // Check that there are no duplicates in the column
    for (var i = 0; i < 9; i++) {
        if (board[i][col] == entry) {
            return false;
        }
    }

    // Check that there are no duplicates in the 3x3 grid
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i + (row - row % 3)][j + (col - col % 3)] == entry) {
                return false;
            }
        }
    }

    return true;
}

function solveSudoku() {
    // Find an empty square
    var row = -1;
    var col = -1;
    inner: 
    for (var i = 0; i < 9; i++) {
        outer: 
        for (var j = 0; j < 9; j++) {
            if (board[i][j] === "") {
                row = i;
                col = j;
                break inner;
            }
        }
    }

    if (row === -1 && col === -1) {
        return true;
    }
    
    for (var entry = 1; entry < 10; entry++) {
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
