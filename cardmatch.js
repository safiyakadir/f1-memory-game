document.addEventListener('DOMContentLoaded', () => {
    const config = {
        gridSize: 4, // 4x4 grid (8 pairs)
        drivers: [
            { id: 1, name: "Max Verstappen", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/verstappen.jpg" },
            { id: 2, name: "Lewis Hamilton", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/hamilton.jpg" },
            { id: 3, name: "Charles Leclerc", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/leclerc.jpg" },
            { id: 4, name: "Lando Norris", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/norris.jpg" },
            { id: 5, name: "Carlos Sainz", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/sainz.jpg" },
            { id: 6, name: "Sergio Perez", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/perez.jpg" },
            { id: 7, name: "George Russell", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/russell.jpg" },
            { id: 8, name: "Fernando Alonso", image: "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/alonso.jpg" }
        ]
    };

    let state = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        timer: 0,
        timerInterval: null,
        gameStarted: false
    };

    const gameBoard = document.getElementById('gameBoard');
    const movesDisplay = document.getElementById('moves');
    const timerDisplay = document.getElementById('timer');
    const resetButton = document.getElementById('reset');
    const winMessage = document.getElementById('winMessage');
    const finalMoves = document.getElementById('finalMoves');
    const finalTime = document.getElementById('finalTime');
    const playAgainButton = document.getElementById('playAgain');

    function initGame() {
        state = {
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            moves: 0,
            timer: 0,
            timerInterval: null,
            gameStarted: false
        };

        movesDisplay.textContent = state.moves;
        timerDisplay.textContent = state.timer;
        winMessage.classList.add('hidden');

        createCards();
    }

    function createCards() {
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${config.gridSize}, 1fr)`;

        let cards = [];
        const selectedDrivers = config.drivers.slice(0, (config.gridSize * config.gridSize) / 2);
        
        selectedDrivers.forEach(driver => {
            cards.push({ ...driver });
            cards.push({ ...driver });
        });

        state.cards = shuffleArray(cards);

        state.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.index = index;

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.style.backgroundImage = `url(${card.image})`;

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');

            cardElement.appendChild(cardFront);
            cardElement.appendChild(cardBack);
            gameBoard.appendChild(cardElement);

            cardElement.addEventListener('click', () => flipCard(index));
        });
    }

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    function flipCard(index) {
        if (state.flippedCards.length === 2 || 
            state.cards[index].matched || 
            state.flippedCards.some(card => card.index === index)) {
            return;
        }

        if (!state.gameStarted) {
            startTimer();
            state.gameStarted = true;
        }

        const cardElement = document.querySelector(`.card[data-index="${index}"]`);
        cardElement.classList.add('flipped');

        state.flippedCards.push({ index, driverId: state.cards[index].id });

        if (state.flippedCards.length === 2) {
            state.moves++;
            movesDisplay.textContent = state.moves;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = state.flippedCards;

        if (card1.driverId === card2.driverId) {
            state.matchedPairs++;
            state.cards[card1.index].matched = true;
            state.cards[card2.index].matched = true;

            document.querySelector(`.card[data-index="${card1.index}"]`).classList.add('matched');
            document.querySelector(`.card[data-index="${card2.index}"]`).classList.add('matched');

            state.flippedCards = [];

            if (state.matchedPairs === (config.gridSize * config.gridSize) / 2) {
                endGame();
            }
        } else {
            setTimeout(() => {
                document.querySelector(`.card[data-index="${card1.index}"]`).classList.remove('flipped');
                document.querySelector(`.card[data-index="${card2.index}"]`).classList.remove('flipped');
                state.flippedCards = [];
            }, 1000);
        }
    }

    function startTimer() {
        state.timerInterval = setInterval(() => {
            state.timer++;
            timerDisplay.textContent = state.timer;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(state.timerInterval);
    }

    function endGame() {
        stopTimer();
        finalMoves.textContent = state.moves;
        finalTime.textContent = state.timer;
        winMessage.classList.remove('hidden');
    }

    resetButton.addEventListener('click', initGame);
    playAgainButton.addEventListener('click', initGame);

    initGame();
});