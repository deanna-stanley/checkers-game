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
    const king = checker.style.getPropertyValue("--king") === "true" ? true : false;
    // const checkerX = parseInt(checker.style.getPropertyValue("--x"));
    // const checkerY = parseInt(checker.style.getPropertyValue("--y"));
    const checkerCoordinate = [
            parseInt(checker.style.getPropertyValue("--x")),
            parseInt(checker.style.getPropertyValue("--y"))
        ];
    
    if (checkerColor !== playerTurn.toLowerCase()) { // If the checker clicked is not the right color do nothing
        // console.log(`Not your turn ${checkerColor}.`);
        return;
    } else if (checkerClicked === checker) { // If the same checker is clicked do nothing
        // console.log("Do nothing");
        return;
    } else if (jump) { // If a jump is in progress do nothing
        return;
    } else { // See if this is the first checker clicked and check for possible moves
        if (checkerClicked !== null) {
        clearMoveMarkers();    
        }
        checkerClicked = checker;
        const possibleMoveDirections = getPossibleMoveDirections(checkerColor, king);
        let destinationCoordinates = [];
        let result = [];
        possibleMoveDirections.forEach(direction => {
            result = addDirectionToCoordinate(checkerCoordinate, direction);
            destinationCoordinates.push(result);
        });
        validateDestinations(destinationCoordinates, possibleMoveDirections, checkerColor);
    }
}

// Determine which directions a checker can move based on color and if it is a king
function getPossibleMoveDirections(checkerColor, king) {
    if (king) {
        return [
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1]
        ];
    } else if (checkerColor === "red") {
        return [
            [1, -1],
            [-1, -1]
        ];
    } else if (checkerColor === "black") {
        return [
            [1, 1],
            [-1, 1]
        ];
    }
}

// Add the possible move values to the starting x and y values to determine
// what squares the checker could possibly move to
function addDirectionToCoordinate(startingCoordinate, possibleMoveDirection) {
    const x = startingCoordinate[0] + possibleMoveDirection[0];
    const y = startingCoordinate[1] + possibleMoveDirection[1];
    return [x,y];
}

// Check to see if the destinations are valid spaces on the board 
// and then if they are empty or can be jumped and create move markers where appropriate
function validateDestinations(destinationCoordinates, possibleMoveDirections, checkerColor, jumpsOnly = false) { // TODO: change name of function or move out creation of move markers
    let jumpCoordinate = [];
    let emptyResult;
    destinationCoordinates.forEach((coordinate, i) => {
        if (isCoordinateOnBoard(coordinate)) {
            emptyResult = isSquareEmpty(coordinate);
            if (emptyResult.Empty && !jumpsOnly) {
                createMoveMarker(coordinate);
            } else if (!emptyResult.Empty && emptyResult.Color !== checkerColor) {
                // check if it can be jumped
                jumpCoordinate = addDirectionToCoordinate(coordinate, possibleMoveDirections[i]);
                if (isCoordinateOnBoard(jumpCoordinate)) {
                    emptyResult = isSquareEmpty(jumpCoordinate);
                    if (emptyResult.Empty) {
                        createMoveMarker(jumpCoordinate, true, coordinate);
                    }
                }
            }
        }
    });
}

function isCoordinateOnBoard(coordinate) {
    return ((coordinate[0] >= 0 && coordinate[0] <= 7) && (coordinate[1] >= 0 && coordinate[1] <= 7)) ? true : false;
}

function isSquareEmpty(coordinate) {
    let empty;
    let checkerColor;
    const x = coordinate[0];
    const y = coordinate[1];
    
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

function createMoveMarker(coordinate, jump = false, jumpedCheckerCoordinate) {
    const x = coordinate[0];
    const y = coordinate[1];
    let moveMarker = document.createElement("span");
    moveMarker.className = "moveMarker";
    moveMarker.style.setProperty("--x", x);
    moveMarker.style.setProperty("--y", y);
    moveMarker.style.setProperty("--jump", jump);
    if (jump) {
        moveMarker.style.setProperty("--jumpedX", jumpedCheckerCoordinate[0]);
        moveMarker.style.setProperty("--jumpedY", jumpedCheckerCoordinate[1]);
    }
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
    
    const marker = event.target;
    
    clearMoveMarkers();
    
    const checkerColor = checkerClicked.style.getPropertyValue("--color");
    let king = checkerClicked.style.getPropertyValue("--king") === "true" ? true : false;

    // Move checker to new position
    const checkerX = parseInt(checkerClicked.style.getPropertyValue("--x"));
    const checkerY = parseInt(checkerClicked.style.getPropertyValue("--y"));
    const checkerNewX = parseInt(marker.style.getPropertyValue("--x"));
    const checkerNewY = parseInt(marker.style.getPropertyValue("--y"));
    
    checkerArray[checkerNewY][checkerNewX] = checkerArray[checkerY][checkerX]; // TODO: Fix this
    checkerArray[checkerY][checkerX] = null;
    checkerClicked.style.setProperty("--x", checkerNewX);
    checkerClicked.style.setProperty("--y", checkerNewY);
    
    if (((checkerNewY === 7 && checkerColor === 'black') || (checkerNewY === 0 && checkerColor === 'red')) && !king) {
        makeKing(checkerColor);
        king = true;
    }
    
    // If move was a jump remove the jumped checker
    if (marker.style.getPropertyValue("--jump") === "true") {
        jump = true; // TODO: do I still need this variable?
        const jumpedCheckerX = parseInt(marker.style.getPropertyValue("--jumpedX"));
        const jumpedCheckerY = parseInt(marker.style.getPropertyValue("--jumpedY"));
        const checkerToRemove = checkerArray[jumpedCheckerY][jumpedCheckerX];
        checkerToRemove.parentNode.removeChild(checkerToRemove);
        checkerArray[jumpedCheckerY][jumpedCheckerX] = null;

        // TODO: check if there are any more jumps (put this in function?)
        const possibleMoveDirections = getPossibleMoveDirections(checkerColor, king);
        let destinationCoordinates = [];
        let result = [];
        possibleMoveDirections.forEach(direction => {
            result = addDirectionToCoordinate([checkerNewX, checkerNewY], direction);
            destinationCoordinates.push(result);
        });
        validateDestinations(destinationCoordinates, possibleMoveDirections, checkerColor, true);
    }
    
    if (moveMarkerArray.length === 0) {
        
        
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
    checkerClicked.style.setProperty("--king", "true");
    if (checkerColor === "black") {
        checkerClicked.src = blackKingUrl;
        checkerClicked.alt = "black king checker";
    } else if (checkerColor === "red") {
        checkerClicked.src = redKingUrl;
        checkerClicked.alt = "red king checker";
    }
}

createBoard();
playerTurnHeader.textContent = playerTurnHeaderText;