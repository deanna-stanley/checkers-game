function createBoard() {
    const boardDiv = document.querySelector("#checkerBoard");

    // Loop 8 times to create the 8 rows on the board
    for (let i = 0; i < 8; i++) {
        let rowDiv = document.createElement("div");
        rowDiv.className = "d-flex";
        boardDiv.appendChild(rowDiv);
        let rowArray = [];
        // Loop 8 times to create the 8 squares in each row
        for (let j = 0; j < 8; j++) {
            let image = null;
            let squareDiv = document.createElement("div");
            if ((i + j) % 2 === 0) {
                squareDiv.className = "red-square";
                // rowArray.push(null);
            } else { 
                // Put checkers on the black spaces of the first 3 rows and last 3 rows
                squareDiv.className = "black-square";
                if (i <= 2) {
                    image = document.createElement("img");
                    image.src = new URL("../img/black.svg", import.meta.url);
                    image.alt = "black checker";
                    image.className = 'checker';
                    image.style.setProperty('--x', j);
                    image.style.setProperty('--y', i);
                    boardDiv.appendChild(image);
                } else if (i >= 5) {
                    image = document.createElement("img");
                    image.src = new URL("../img/red.svg", import.meta.url);
                    image.alt = "red checker"
                    image.className = 'checker';
                    image.style.setProperty('--x', j);
                    image.style.setProperty('--y', i);
                    boardDiv.appendChild(image);
                }
            }
            rowDiv.appendChild(squareDiv);
        }
    }

}

createBoard();