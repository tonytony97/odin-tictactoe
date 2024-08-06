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
        console.log(boardWithCellValues);
    };

    // Interface for board
    return { getBoard, checkCell, dropToken, printBoard };
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
        },
        {
            name: playerTwoName,
            token: "O",
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
        // Drop token for current player
        usedCell = board.checkCell(row, column);
        if (usedCell === true) {
            return;
        }
        console.log(
            `Dropping ${
                getActivePlayer().name
            }'s token into row ${row}, column ${column}...`,
        );

        board.dropToken(row, column, getActivePlayer().token);

        //Win condition

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
