const boardArray = [];
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
                if (i <= 2) {
                    image = document.createElement("img");
                    image.src = blackCheckerUrl;
                    image.alt = "black checker";
                    image.className = "checker";
                    image.style.setProperty("--x", j);
                    image.style.setProperty("--y", i);
                    image.style.setProperty("--color", "black");
                    image.addEventListener("click", checkerClick);
                    boardDiv.appendChild(image);
                } else if (i >= 5) {
                    image = document.createElement("img");
                    image.src = redCheckerUrl;
                    image.alt = "red checker"
                    image.className = "checker";
                    image.style.setProperty("--x", j);
                    image.style.setProperty("--y", i);
                    image.style.setProperty("--color", "red");
                    image.addEventListener("click", checkerClick);
                    boardDiv.appendChild(image);
                }
            }
            rowArray.push(squareDiv);
            rowDiv.appendChild(squareDiv);
        }
        boardArray.push(rowArray);
    }

}

function checkerClick(event) {
    const checker = event.target;
    const checkerColor = checker.style.getPropertyValue("--color");
    // If the checker clicked is not the right color don't continue
    if (checkerColor !== playerTurn) {
        console.log(`Not your turn ${checkerColor}.`);
        return
    }

    const checkerX = parseInt(checker.style.getPropertyValue("--x"));
    const checkerY = parseInt(checker.style.getPropertyValue("--y"));
    
    if (checkerX === 0) {
        console.log("Only one possible move.");
    } else if (checkerX === 7) {
        console.log("Only one possible move.");
    } else {
        console.log("Two possible moves.");
    }
    console.log(checker);
    console.log(checkerColor);
    console.log(checkerX);
    console.log(checkerY);
}

function isSquareEmpty(x, y) {

}

createBoard();
// console.log(boardArray);
