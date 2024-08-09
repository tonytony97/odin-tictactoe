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

    function checkWin() {
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
                return true;
            }
        }
    }

    // Interface for board
    return { getBoard, checkCell, dropToken, printBoard, checkWin };
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

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        const usedCell = board.checkCell(row, column);

        //Check if cell is already used
        if (usedCell === true) {
            return;
        }
        // Drop token for current player
        console.log(
            `Dropping ${
                getActivePlayer().name
            }'s token into row ${row}, column ${column}...`,
        );

        board.dropToken(row, column, getActivePlayer().token);

        //Win condition
        const matchWin = board.checkWin(getActivePlayer().name);
        if (matchWin == true) {
            console.log(`The winner is: ${getActivePlayer().name}`);
            getActivePlayer().score += 1;
            console.log(`${players[0].name}'s Score: ${players[0].score}`);
            console.log(`${players[1].name}'s Score: ${players[1].score}`);
        }
        //Switch player turn
        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
    };
}

const game = GameController();
