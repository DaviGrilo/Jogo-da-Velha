let gameBoard = [];
let currentPlayer = 'x';
let player = 'x';  // Player choice
let gameOver = false;
let vsMachine = false;

document.getElementById('solo-button').onclick = () => startGame(true);
document.getElementById('two-player-button').onclick = () => startGame(false);
document.getElementById('restart-button').onclick = restartGame;

function startGame(machine) {
    vsMachine = machine;
    player = document.getElementById('player-choice').value;
    currentPlayer = player;
    document.querySelector('.menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'flex';
    resetGame();

    if (vsMachine && player === 'o') {
        // Player chose 'o', so the machine should start with 'x'
        currentPlayer = 'x';
        setTimeout(makeMachineMove, 500);
    }
}

function handleCellClick(event) {
    if (gameOver || event.target.classList.contains(currentPlayer)) return;
    const cellIndex = event.target.id.replace('cell-', '');
    if (gameBoard[cellIndex] === '') {
        gameBoard[cellIndex] = currentPlayer;
        event.target.classList.add(currentPlayer);
        event.target.textContent = currentPlayer.toUpperCase();
        if (checkWinner()) {
            gameOver = true;
            setTimeout(() => alert(`Player ${currentPlayer.toUpperCase()} wins!`), 10);
            document.getElementById('restart-button').style.display = 'block';
        } else if (gameBoard.every(cell => cell !== '')) {
            gameOver = true;
            setTimeout(() => alert('Empate!'), 10);
            document.getElementById('restart-button').style.display = 'block';
        } else {
            currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
            if (vsMachine && currentPlayer !== player) {
                setTimeout(makeMachineMove, 500);
            }
        }
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }
    return null;
}

function restartGame() {
    document.getElementById('restart-button').style.display = 'none';
    document.querySelector('.menu').style.display = 'flex';
    document.querySelector('.game-container').style.display = 'none';
    resetGame();
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    currentPlayer = player;
    for (let i = 0; i < 9; i++) {
        document.getElementById(`cell-${i}`).textContent = '';
        document.getElementById(`cell-${i}`).className = 'cell';
        document.getElementById(`cell-${i}`).onclick = handleCellClick;
    }
}

function makeMachineMove() {
    let machineSymbol = player === 'x' ? 'o' : 'x';
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = machineSymbol;
            let score = minimax(gameBoard, 0, false, machineSymbol);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    gameBoard[move] = machineSymbol;
    document.getElementById(`cell-${move}`).classList.add(machineSymbol);
    document.getElementById(`cell-${move}`).textContent = machineSymbol.toUpperCase();
    if (checkWinner()) {
        gameOver = true;
        setTimeout(() => alert(`Player ${machineSymbol.toUpperCase()} wins!`), 10);
        document.getElementById('restart-button').style.display = 'block';
    } else if (gameBoard.every(cell => cell !== '')) {
        gameOver = true;
        setTimeout(() => alert('Empate!'), 10);
        document.getElementById('restart-button').style.display = 'block';
    } else {
        currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
    }
}

function minimax(board, depth, isMaximizing, machineSymbol) {
    let winner = checkWinner();
    if (winner === machineSymbol) return 10 - depth;
    if (winner && winner !== machineSymbol) return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = machineSymbol;
                let score = minimax(board, depth + 1, false, machineSymbol);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = machineSymbol === 'x' ? 'o' : 'x';
                let score = minimax(board, depth + 1, true, machineSymbol);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
