const checkerArray = [];
const blackCheckerUrl = new URL("../img/black.svg", import.meta.url);
const redCheckerUrl = new URL("../img/red.svg", import.meta.url);
let playerTurn = "black";

function createBoard() {
    const boardDiv = document.querySelector("#checkerBoard");

    // Loop 8 times to create the 8 rows on the board
    for (let i = 0; i < 8; i++) {
        let rowArray = [];
        let rowDiv = document.createElement("div");
        rowDiv.className = "d-flex";
        boardDiv.appendChild(rowDiv);
        
        // Loop 8 times to create the 8 squares in each row
        for (let j = 0; j < 8; j++) {
            let image;
            let squareDiv = document.createElement("div");
            if ((i + j) % 2 === 0) {
                squareDiv.className = "red-square";
            } else { 
                squareDiv.className = "black-square";
                squareDiv.style.setProperty("--x", j);
                squareDiv.style.setProperty("--y", i);
                
                // Put checkers on the black spaces of the first 3 rows and last 3 rows
                if (i <= 2) { // black checkers
                    image = document.createElement("img");
                    image.src = blackCheckerUrl;
                    image.alt = "black checker";
                    image.className = "checker";
                    image.style.setProperty("--x", j);
                    image.style.setProperty("--y", i);
                    image.style.setProperty("--color", "black");
                    image.addEventListener("click", checkerClick);
                    boardDiv.appendChild(image);
                } else if (i >= 5) { // red checkers
                    image = document.createElement("img");
                    image.src = redCheckerUrl;
                    image.alt = "red checker"
                    image.className = "checker";
                    image.style.setProperty("--x", j);
                    image.style.setProperty("--y", i);
                    image.style.setProperty("--color", "red");
                    image.addEventListener("click", checkerClick);
                    boardDiv.appendChild(image);
                } else { // no checkers
                    image = null;
                }
            }
            rowArray.push(image);
            rowDiv.appendChild(squareDiv);
        }
        checkerArray.push(rowArray);
        // console.log(checkerArray);
    }

}

function checkerClick(event) {
    const checker = event.target;
    const checkerColor = checker.style.getPropertyValue("--color");
    const checkerX = parseInt(checker.style.getPropertyValue("--x"));
    const checkerY = parseInt(checker.style.getPropertyValue("--y"));
    // If the checker clicked is not the right color don't continue
    if (checkerColor !== playerTurn) {
        console.log(`Not your turn ${checkerColor}.`);
        return
    } else {
        possibleMoves(checkerColor, checkerX, checkerY);
    }
}

function possibleMoves(checkerColor, x, y) {
    let yDirection;
    let result;

    if (checkerColor === "black") {
        yDirection = 1;
    } else {
        yDirection = -1;
    }

    if (x === 0) {
        // can only move to x + 1, y + yDirection
        console.log("Only one possible move.");
        result = isSquareEmpty(x + 1, y + yDirection);
        console.log(result);
    } else if (x === 7) {
        // can only move to x - 1, y + yDirection
        console.log("Only one possible move.");
        result = isSquareEmpty(x - 1, y + yDirection);
        console.log(result);
    } else {
        // can move to x + 1, y + yDirection
        // OR to x - 1, y + yDirection
        console.log("Two possible moves.");
        result = isSquareEmpty(x + 1, y + yDirection);
        console.log(`x + 1 result: ${result}`);
        result = isSquareEmpty(x - 1, y + yDirection);
        console.log(`x - 1 result: ${result}`);
    }
}

function isSquareEmpty(x, y) {
    if (checkerArray[y][x] === null) {
        return true;
    } else {
        return false;
    }
}

createBoard();
// const el = document.body.querySelector("style[CSS.escape(--x)='7'], style[CSS.escape(--y)='6']");
// console.log(el);
// console.log(boardArray);


// TODO: make an array of checkers