function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    //Render board
    const getBoard = () => board;

    //Check if cell value != 0 to return value to prevent skipping player turn
    const checkCell = (row, column) => {
        if (board[row][column].getValue() != 0) {
            console.log(`Row ${row}, Column ${column} is already occupied!`);
            return true;
        }
    };

    //Place tokens in specified row and column
    const dropToken = (row, column, player) => {
        // loop array, check cell with 0
        const availableCells = board
            .filter((row) => row[column].getValue() === 0)
            .map((row) => row[column]);

        // If no cells make it through the filter,
        // the move is invalid. Stop execution.
        if (!availableCells.length) return;
        board[row][column].addToken(player);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
            row.map((cell) => cell.getValue()),
        );

        //const checkRowO = (row) => boardWithCellValues[row].every(checkAllO);
        console.log(boardWithCellValues);
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                board[i][j].addToken(0);
            }
        }
    };
    const checkWin = () => {
        const checkAllX = (value) => value === "X";
        const checkAllO = (value) => value === "O";

        function checkRow(row) {
            let arrayRow = [];
            for (let i = 0; i < board.length; i++) {
                arrayRow.push(board[row][i].getValue());
            }
            return arrayRow;
        }

        function checkColumn(column) {
            let arrayColumn = [];
            for (let i = 0; i < board.length; i++) {
                arrayColumn.push(board[i][column].getValue());
            }
            return arrayColumn;
        }

        function checkDiagonal() {
            let arrayDiagonal = [];
            for (let i = 0; i < board.length; i++) {
                arrayDiagonal.push(board[i][i].getValue());
            }
            return arrayDiagonal;
        }

        function checkReverseDiagonal() {
            let arrayRDiagonal = [];
            arrayRDiagonal.push(board[0][2].getValue());
            arrayRDiagonal.push(board[1][1].getValue());
            arrayRDiagonal.push(board[2][0].getValue());
            return arrayRDiagonal;
        }

        for (let i = 0; i < board.length; i++) {
            if (
                checkRow(i).every(checkAllX) === true ||
                checkRow(i).every(checkAllO) === true ||
                checkColumn(i).every(checkAllX) === true ||
                checkColumn(i).every(checkAllO) === true ||
                checkDiagonal().every(checkAllO) === true ||
                checkDiagonal().every(checkAllX) === true ||
                checkReverseDiagonal().every(checkAllX) === true ||
                checkReverseDiagonal().every(checkAllO) === true
            ) {
                resetBoard();
                return true;
            }
        }
    };

    const checkTie = () => {
        const arrayTie = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                if (board[i][j].getValue() == 0) {
                    arrayTie.push(board[i][j].getValue());
                }
            }
        }
        if (arrayTie.length == 0) {
            resetBoard();
            return true;
        }
    };

    // Interface for board
    return {
        getBoard,
        checkCell,
        dropToken,
        printBoard,
        resetBoard,
        checkWin,
        checkTie,
    };
}

function Cell() {
    let value = 0;

    // Accept player token, change value of cell
    const addToken = (player) => {
        value = player;
    };

    // Retrieve cell value with clousure
    const getValue = () => value;

    return {
        addToken,
        getValue,
    };
}

//Control game flow
function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two",
) {
    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            token: "X",
            score: 0,
        },
        {
            name: playerTwoName,
            token: "O",
            score: 0,
        },
    ];

    let activePlayer = players[0];
    const getPlayer = (num) => players[num];
    const inputName = (num) => {
        newName = prompt(
            `Enter ${getPlayer(num).name} name`,
            getPlayer(num).name,
        );
        if (newName != null) {
            getPlayer(num).name = newName;
        }
    };

    inputName(0);
    inputName(1);
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    /*const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };*/

    const playRound = (row, column) => {
        const usedCell = board.checkCell(row, column);

        //Check if cell is already used
        if (usedCell === true) {
            return;
        }
        // Drop token for current player
        console.log(
            `Adding ${
                getActivePlayer().name
            } symbol into row ${row}, column ${column}...`,
        );

        board.dropToken(row, column, getActivePlayer().token);
        board.printBoard();
        //Win condition
        const matchWin = board.checkWin(getActivePlayer().name);
        const matchTie = board.checkTie();
        if (matchWin == true) {
            alert(`The winner is: ${getActivePlayer().name}!`);
            getActivePlayer().score += 1;
            activePlayer = players[0];
            return;
        } else if (matchTie == true) {
            alert("Match ended in a Tie!");
            return;
        }
        //Switch player turn
        switchPlayerTurn();
    };

    return {
        playRound,
        getActivePlayer,
        getPlayer,
        getBoard: board.getBoard,
    };
}

function ScreenController() {
    const game = GameController();
    const displayTurn = document.querySelector(".turn");
    const displayScore1 = document.querySelector(".player1");
    const displayScore2 = document.querySelector(".player2");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        boardDiv.textContent = "";

        let rowIndex = 0;

        // get newest version of board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const playerOne = game.getPlayer(0);
        const playerTwo = game.getPlayer(1);

        displayScore1.textContent =
            `${playerOne.name}'s Score: ` + playerOne.score;
        displayScore2.textContent =
            `${playerTwo.name}'s Score: ` + playerTwo.score;
        displayTurn.textContent = `${activePlayer.name}'s turn...`;

        // Render board squares
        board.forEach((row) => {
            row.forEach((cell, index) => {
                // Create clickable button elements each row
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // Create data attribute to identify column
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = index;

                cellButton.textContent = cell.getValue();
                if (cellButton.textContent === "0") {
                    cellButton.textContent = "";
                }
                boardDiv.appendChild(cellButton);
                if (index == 2) {
                    rowIndex += 1;
                }
            });
        });
    };

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        // Make sure button is clicked
        if (!selectedColumn) return;
        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);

    // Initial render
    updateScreen();
}

ScreenController();
