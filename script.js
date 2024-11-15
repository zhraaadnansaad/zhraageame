document.addEventListener("DOMContentLoaded", function() {
    const gameBoard = document.getElementById("gameBoard");
    const scoreDisplay = document.getElementById("score");
    const menu = document.getElementById("menu");
    const gameOverScreen = document.getElementById("gameOver");
    const finalScoreDisplay = document.getElementById("finalScore");
    const startButton = document.getElementById("startButton");
    const restartButton = document.getElementById("restartButton");

    const boardSize = 20;
    const board = Array.from({ length: boardSize * boardSize }, function(_, i) {
        const cell = document.createElement('div');
        gameBoard.appendChild(cell);
        return cell;
    });

    let snake = [2, 1, 0];
    let direction = 1;
    let foodIndex = 0;
    let score = 0;
    let interval;

    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", startGame);

    function startGame() {
        snake = [2, 1, 0];
        direction = 1;
        score = 0;
        scoreDisplay.textContent = score;
        gameBoard.style.display = "grid";
        gameOverScreen.style.display = "none";
        menu.style.display = "none";
        board.forEach(cell => cell.classList.remove('snake', 'snake-head', 'food'));
        snake.forEach(function(index, i) {
            if (i === 0) {
                board[index].classList.add('snake-head');
            } else {
                board[index].classList.add('snake');
            }
        });
        generateFood();
        document.addEventListener('keydown', control);
        gameBoard.addEventListener('touchstart', handleTouchStart);
        gameBoard.addEventListener('touchmove', handleTouchMove);
        clearInterval(interval);
        interval = setInterval(move, 200);
    }

    function move() {
        if (
            (snake[0] % boardSize === boardSize - 1 && direction === 1) ||
            (snake[0] % boardSize === 0 && direction === -1) ||
            (snake[0] - boardSize < 0 && direction === -boardSize) ||
            (snake[0] + boardSize >= boardSize * boardSize && direction === boardSize) ||
            board[snake[0] + direction].classList.contains('snake')
        ) {
            endGame();
            return;
        }

        const tail = snake.pop();
        board[tail].classList.remove('snake');
        snake.unshift(snake[0] + direction);
        board[snake[0]].classList.add('snake-head');
        if (snake.length > 1) {
            board[snake[1]].classList.remove('snake-head');
            board[snake[1]].classList.add('snake');
        }

        if (board[snake[0]].classList.contains('food')) {
            board[snake[0]].classList.remove('food');
            snake.push(tail);
            board[tail].classList.add('snake');
            generateFood();
            score++;
            scoreDisplay.textContent = score;
        }
    }

    function generateFood() {
        do {
            foodIndex = Math.floor(Math.random() * board.length);
        } while (board[foodIndex].classList.contains('snake'));
        board[foodIndex].classList.add('food');
    }

    function control(event) {
        if (event.key === 'ArrowRight' && direction !== -1) direction = 1;
        else if (event.key === 'ArrowUp' && direction !== boardSize) direction = -boardSize;
        else if (event.key === 'ArrowLeft' && direction !== 1) direction = -1;
        else if (event.key === 'ArrowDown' && direction !== -boardSize) direction = boardSize;
    }

    let xDown = null;
    let yDown = null;

    function handleTouchStart(event) {
        const firstTouch = event.touches[0];
        xDown = firstTouch.clientX;
        yDown = firstTouch.clientY;
    }

    function handleTouchMove(event) {
        if (!xDown || !yDown) return;

        let xUp = event.touches[0].clientX;
        let yUp = event.touches[0].clientY;

        let xDiff = xDown - xUp;
        let yDiff = yDown - yUp;
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0 && direction !== 1) direction = -1;
            else if (xDiff < 0 && direction !== -1) direction = 1;
        } else {
            if (yDiff > 0 && direction !== boardSize) direction = -boardSize;
            else if (yDiff < 0 && direction !== -boardSize) direction = boardSize;
        }

        xDown = null;
        yDown = null;
    }

    function endGame() {
        clearInterval(interval);
        finalScoreDisplay.textContent = score;
        gameOverScreen.style.display = "flex";
        gameBoard.style.display = "none";
    }
});