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

// Tiny helper functions to streamline the getting and setting of element dataset values
// Base helpers
const getData = (el, key) => el.dataset[key];
const getNum  = (el, key) => Number(el.dataset[key]);
const getBool = (el, key) => el.dataset[key] === "true";

const setData = (el, key, value) => { el.dataset[key] = String(value); };
const setNum  = (el, key, value) => { el.dataset[key] = String(Number(value)); };
const setBool = (el, key, value) => { el.dataset[key] = value ? "true" : "false"; };

// Write dataset AND the CSS var
// For use with x and y since those are used in CSS calculations
function setNumState(el, key, value, { cssVar = true } = {}) {
  setNum(el, key, value);
  el.style.setProperty(`--${key}`, el.dataset[key]);
}

function createChecker(color, x, y) {
    const image = document.createElement("img");
    image.className = "checker";
    image.src = color === "black" ? blackCheckerUrl : redCheckerUrl;
    image.alt = `${color} checker`;
    setNumState(image, "x", x);
    setNumState(image, "y", y);
    setData(image, "color", color);
    setBool(image, "king", false);
    image.draggable = false;
    image.addEventListener("click", checkerClick);
    return image;
}

function createBoard() {
    const frag = document.createDocumentFragment();
    
    for (let y = 0; y < 8; y++) {
        const row = [];
        const rowDiv = document.createElement("div");
        rowDiv.className = "board-row";
        
        for (let x = 0; x< 8; x++) {
            let checker = null;
            const square = document.createElement("div");
            const isRed = ((x +y) % 2) === 0;
            square.className = isRed ? "red-square" : "black-square";

            if(!isRed) {
                if (y <= 2) {
                    checker = createChecker("black", x, y);
                } else if (y >= 5) {
                    checker = createChecker("red", x, y);
                }
            }

            row.push(checker);
            rowDiv.appendChild(square);
            if (checker) {
                frag.appendChild(checker);
            }
        }

        checkerArray.push(row);
        frag.appendChild(rowDiv);
    }

    boardDiv.innerHTML = ""; // safe reset
    boardDiv.appendChild(frag);
}

function checkerClick(event) {
    const checker = event.target;
    const checkerColor = getData(checker, "color");
    const isKing = getBool(checker, "king");
    const checkerCoordinate = [
        getNum(checker, "x"),
        getNum(checker, "y"),
    ];
    
    // Guard clause: if the checker clicked is the wrong color, or is the same checker clicked again,
    // or a jump is in progress then exit without doing anything
    if (
        checkerColor !== playerTurn.toLowerCase() ||
        checkerClicked === checker || 
        jump
    ) {
        return;
    }

    // Main move logic

    // If a previous checker was clicked then clear the move markers
    if (checkerClicked !== null) {
        clearMoveMarkers();    
    }

    checkerClicked = checker;
    
    findAndRenderMoves(checkerCoordinate, checkerColor, isKing);
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
function validateDestinations(destinationCoordinates, possibleMoveDirections, checkerColor, jumpsOnly = false) {
    destinationCoordinates.forEach((coordinate, i) => {
        if (!isCoordinateOnBoard(coordinate)) {
            return;
        }

        const { Empty, Color } = isSquareEmpty(coordinate);

        if (Empty && !jumpsOnly) {
            createMoveMarker(coordinate);
        }

        if (!Empty && Color !== checkerColor) {
            const jumpCoordinate = addDirectionToCoordinate(coordinate, possibleMoveDirections[i]);
            if (isCoordinateOnBoard(jumpCoordinate) && isSquareEmpty(jumpCoordinate).Empty) {
                createMoveMarker(jumpCoordinate, true, coordinate);
            }
        }
    });
}

function isCoordinateOnBoard([x, y]) {
    return (x >= 0 && x <= 7) && (y >= 0 && y <= 7);
}

function isSquareEmpty([x, y]) {
    const checker = checkerArray[y][x]
    
    return {
        Empty: !checker,
        Color: checker ? getData(checker, "color") : null
    };
}

function createMoveMarker([x, y], jump = false, jumpedCheckerCoordinate = null) {
    const moveMarker = document.createElement("span");
    moveMarker.className = "moveMarker";
    setNumState(moveMarker, "x", x);
    setNumState(moveMarker, "y", y);
    setBool(moveMarker, "jump", jump)
     
    if (jump && jumpedCheckerCoordinate) {
        const [jumpedX, jumpedY] = jumpedCheckerCoordinate
        setNum(moveMarker, "jumpedX", jumpedX);
        setNum(moveMarker, "jumpedY", jumpedY);
    }

    moveMarker.addEventListener("click", moveMarkerClick);
    boardDiv.appendChild(moveMarker);
    moveMarkerArray.push(moveMarker);
}

function clearMoveMarkers() {
    while (moveMarkerArray.length) {
        const marker = moveMarkerArray.pop();
        marker.remove();
    }
}

function moveMarkerClick(event) {
    const marker = event.currentTarget;
    
    clearMoveMarkers();
    
    const checkerColor = getData(checkerClicked, "color");
    let isKing = getBool(checkerClicked, "king");

    // Current and new positions
    const checkerX = getNum(checkerClicked, "x");
    const checkerY = getNum(checkerClicked, "y");
    const checkerNewX = getNum(marker, "x");
    const checkerNewY = getNum(marker, "y");
    
    // Move checker to new position
    checkerArray[checkerNewY][checkerNewX] = checkerArray[checkerY][checkerX];
    checkerArray[checkerY][checkerX] = null;
    setNumState(checkerClicked, "x", checkerNewX);
    setNumState(checkerClicked, "y", checkerNewY);
    
    // Promote to king if reaching the far row and not already a king
    const reachedKingRow = (checkerColor === "black" && checkerNewY === 7) || (checkerColor === "red" && checkerNewY === 0);
    if (reachedKingRow && !isKing) {
        makeKing(checkerColor);
        isKing = true;
    }
    
    // If move was a jump remove the jumped checker and check for additional jumps
    const wasJump = getBool(marker, "jump");
    if (wasJump) {
        // Mark jump state
        jump = true;

        // Remove jumped checker
        const jumpedCheckerX = getNum(marker, "jumpedX");
        const jumpedCheckerY = getNum(marker, "jumpedY");
        const jumpedChecker = checkerArray[jumpedCheckerY][jumpedCheckerX];
        if (jumpedChecker) {
            jumpedChecker.remove();
            checkerArray[jumpedCheckerY][jumpedCheckerX] = null;
        }
        
        // 'true' indicates that we are only looking for chain jumps
        findAndRenderMoves([checkerNewX, checkerNewY], checkerColor, isKing, true);
    }
    
    // If no more markers were generated then clear checkerClicked and jump and end the turn
    if (moveMarkerArray.length === 0) {
        checkerClicked = null;
        jump = false;
    
        endTurn();
    }
}

function endTurn() {
    playerTurn = (playerTurn === "Black") ? "Red" : "Black";
    playerTurnHeaderText = `${playerTurn}'s Turn`;
    playerTurnHeader.textContent = playerTurnHeaderText;
    playerTurnHeader.style.color = playerTurn.toLowerCase();
}

function makeKing(checkerColor) {
    setBool(checkerClicked, "king", true);
    if (checkerColor === "black") {
        checkerClicked.src = blackKingUrl;
        checkerClicked.alt = "black king checker";
    } else {
        checkerClicked.src = redKingUrl;
        checkerClicked.alt = "red king checker";
    }
}

function findAndRenderMoves(checkerCoordinate, checkerColor, isKing, jumpsOnly = false) {
    const possibleMoveDirections = getPossibleMoveDirections(checkerColor, isKing);
    const destinationCoordinates = possibleMoveDirections.map(direction => 
        addDirectionToCoordinate(checkerCoordinate, direction)
    );
    validateDestinations(destinationCoordinates, possibleMoveDirections, checkerColor, jumpsOnly);
}

createBoard();
playerTurnHeader.textContent = playerTurnHeaderText;