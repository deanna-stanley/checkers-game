const checkerArray = [];
const moveMarkerArray = [];
const blackCheckerUrl = new URL("../img/black.svg", import.meta.url);
const redCheckerUrl = new URL("../img/red.svg", import.meta.url);
const blackKingUrl = new URL("../img/black_king.svg", import.meta.url);
const redKingUrl = new URL("../img/red_king.svg", import.meta.url);
const boardDiv = document.querySelector("#checkerBoard");
const playerTurnHeader = document.querySelector("#playerTurnHeader");
let playerTurn = "Black";
let playerTurnHeaderText = `${playerTurn}'s Turn`;
let checkerClicked = null;
let jump = false;

function createBoard() {
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
                    image.style.setProperty("--king", "false");
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
                    image.style.setProperty("--king", "false");
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
    
    if (checkerColor !== playerTurn.toLowerCase()) { // If the checker clicked is not the right color do nothing
        console.log(`Not your turn ${checkerColor}.`);
        return;
    } else if (checkerClicked === checker) { // If the same checker is clicked do nothing
        console.log("Do nothing");
        return;
    } else if (jump) {
        return;
    } else { // See if this is the first checker clicked and check for possible moves
        if (checkerClicked !== null) {
        clearMoveMarkers();    
        }
        checkerClicked = checker;
        possibleMoves(checkerColor, checkerX, checkerY, jump);
    }
}

function possibleMoves(checkerColor, x, y, jumpsOnly) {
    let newXPlus = x + 1;
    let newXMinus = x - 1;
    let yDirection;
    let jumpX;
    let jumpY;
    let resultPlus = {
        Empty: null,
        Color: null
    };
    let resultMinus = {
        Empty: null,
        Color: null
    };

    if (checkerColor === "black") {
        yDirection = 1;
    } else {
        yDirection = -1;
    }

    const newY = y + yDirection;

    if (x === 0) {
        // can only move to x + 1, y + yDirection
        // console.log("Only one possible move.");
        resultPlus = isSquareEmpty(newXPlus, newY);
        // console.log(resultPlus);
    } else if (x === 7) {
        // can only move to x - 1, y + yDirection
        // console.log("Only one possible move.");
        resultMinus = isSquareEmpty(newXMinus, newY);
        // console.log(newXMinus, newY)
        // console.log(resultMinus);
    } else {
        // can move to x + 1, y + yDirection
        // OR to x - 1, y + yDirection
        // console.log("Two possible moves.");
        resultPlus = isSquareEmpty(newXPlus, newY);
        // console.log(`x + 1 resultPlus: ${resultPlus}`);
        resultMinus = isSquareEmpty(newXMinus, newY);
        // console.log(`x - 1 resultMinus: ${resultMinus}`);
    }

    if (resultPlus.Empty && !jumpsOnly) {
        createMoveMarker(newXPlus, newY);
    } else if ((resultPlus.Empty === false) && (checkerColor !== resultPlus.Color)) {
        if (!(newXPlus === 0 || newXPlus === 7)) { //TODO: also check for y of 0 or 7
            jumpY = newY + yDirection;
            jumpX = newXPlus + 1;
            let jumpResult = isSquareEmpty(jumpX, jumpY);
            if (jumpResult.Empty) {
                createMoveMarker(jumpX, jumpY);
            }
            // console.log("check for jump");
        }
    }

    if (resultMinus.Empty && !jumpsOnly) {
        createMoveMarker(newXMinus, newY);
    } else if ((resultMinus.Empty === false) && (checkerColor !== resultMinus.Color)) {
        if (!(newXMinus === 0 || newXMinus === 7)) { //TODO: also check for y of 0 or 7
            jumpY = newY + yDirection;
            jumpX = newXMinus - 1;
            let jumpResult = isSquareEmpty(jumpX, jumpY);
            if (jumpResult.Empty) {
                createMoveMarker(jumpX, jumpY);
            }
        }
        // console.log("check for jump");
    }
}

function isSquareEmpty(x, y) {
    let empty;
    let checkerColor;
    
    if (checkerArray[y][x] === null) {
        empty = true;
        checkerColor = null;
    } else {
        empty = false;
        // console.log(checkerArray[y][x]);
        const checker = checkerArray[y][x];
        // console.log(checker.style.getPropertyValue("--color"));
        checkerColor = checker.style.getPropertyValue("--color");
        // console.log(checkerColor);
    }

    return {
        Empty: empty,
        Color: checkerColor
    };
}

function createMoveMarker(x, y) {
    let moveMarker = document.createElement("span");
    moveMarker.className = "moveMarker";
    moveMarker.style.setProperty("--x", x);
    moveMarker.style.setProperty("--y", y);
    moveMarker.addEventListener("click", moveMarkerClick);
    boardDiv.appendChild(moveMarker);
    moveMarkerArray.push(moveMarker);
}

function clearMoveMarkers() {
    while (moveMarkerArray.length > 0) {
        let marker = moveMarkerArray.pop();
        marker.parentNode.removeChild(marker);
    }
    // console.log(moveMarkerArray);
}

function moveMarkerClick(event) {
    
    clearMoveMarkers();
    
    const checkerColor = checkerClicked.style.getPropertyValue("--color");

    // Move checker to new position
    const marker = event.target;
    const checkerX = parseInt(checkerClicked.style.getPropertyValue("--x"));
    const checkerY = parseInt(checkerClicked.style.getPropertyValue("--y"));
    const checkerNewX = parseInt(marker.style.getPropertyValue("--x"));
    const checkerNewY = parseInt(marker.style.getPropertyValue("--y"));
    
    checkerArray[checkerNewY][checkerNewX] = checkerArray[checkerY][checkerX]; // TODO: Fix this
    checkerArray[checkerY][checkerX] = null;
    checkerClicked.style.setProperty("--x", checkerNewX);
    checkerClicked.style.setProperty("--y", checkerNewY);
    
    // If move was a jump remove the jumped checker
    const xDiff = checkerNewX - checkerX;
    const yDiff = checkerNewY - checkerY;
    let checkerRemoveX;
    let checkerRemoveY;
    if (xDiff === 2) {
        checkerRemoveX = checkerX + 1;        
    } else if (xDiff === -2) {
        checkerRemoveX = checkerX - 1;
    }
    if (yDiff === 2) {
        checkerRemoveY = checkerY + 1;        
    } else if (yDiff === -2) {
        checkerRemoveY = checkerY - 1;
    }
    if (Math.abs(xDiff) === 2) {
        jump = true;
        const checkerToRemove = checkerArray[checkerRemoveY][checkerRemoveX];
        checkerToRemove.parentNode.removeChild(checkerToRemove);
        checkerArray[checkerRemoveY][checkerRemoveX] = null;

        if (((checkerNewY < 6) && (checkerColor === "black")) || ((checkerNewY > 1) && (checkerColor ==="red"))) {
            possibleMoves(checkerColor, checkerNewX, checkerNewY, jump);
        }
    }
    
    if (moveMarkerArray.length === 0) {
        if ((checkerNewY === 7 && checkerColor === 'black') || (checkerNewY === 0 && checkerColor === 'red')) {
            makeKing(checkerColor);
        }
        
        checkerClicked = null;
        jump = false;
    
        changeTurns();
    }
    
}

function changeTurns() {
    if (playerTurn === "Black") {
        playerTurn = "Red";
    } else {
        playerTurn = "Black";
    }
    playerTurnHeaderText = `${playerTurn}'s Turn`;
    playerTurnHeader.textContent = playerTurnHeaderText;
    playerTurnHeader.style.color = playerTurn.toLowerCase();
}

function makeKing(checkerColor) {
    const checkerIsKing = checkerClicked.style.getPropertyValue("--king");
    if (checkerIsKing === "false") {
        checkerClicked.style.setProperty("--king", "true");
        if (checkerColor === "black") {
            checkerClicked.src = blackKingUrl;
            checkerClicked.alt = "black king checker";
        } else if (checkerColor === "red") {
            checkerClicked.src = redKingUrl;
            checkerClicked.alt = "red king checker";
        }
    }
}

createBoard();
playerTurnHeader.textContent = playerTurnHeaderText;