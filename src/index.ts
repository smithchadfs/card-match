// Imports your SCSS stylesheet
import '@/styles/index.scss';

// import cardBackImage from './images/card-back-blue.png';


// Game set up
class CardMatchGame {
    attemptsLeft: number = 3;
    firstCard: HTMLElement | null = null;
    secondCard: HTMLElement | null = null;
    matchesFound: number = 0;
    isComparing: boolean = false;

    attemptsDisplay: HTMLElement;
    gameBoard: HTMLElement;
    winLoseMessage: HTMLElement;
    resetButton: HTMLButtonElement;

    constructor() {
        this.attemptsDisplay = document.getElementById('attemptsLeft')!;
        this.gameBoard = document.querySelector('.game-board')!;
        this.winLoseMessage = document.getElementById('winLose')!;
        this.resetButton = document.querySelector('button[type="reset"]')!;

        this.init();
    }
    // Initialize game
    init() {
        // display intial attempts
        this.updateAttemptsDisplay();

        // Shuffle cards
        this.shuffleCards();

        // Add click listeners to all cards
        this.addCardListeners();

        // Add click listener to reset button
        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    updateAttemptsDisplay() {
        this.attemptsDisplay.textContent = this.attemptsLeft.toString();
    }

    addCardListeners() {
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.addEventListener('click', (e) => this.handleCardClick(e));
        });
    }

    shuffleCards() {
        // Array to hold card values
        const values = ['A', 'A', 'B', 'B', 'C', 'C']

        //Shuffle cards randomly
        const shuffled = values.sort(() => Math.random() - 0.5);

        // Get all card elements
        const allCards = document.querySelectorAll('.card');

        // Assing shuffled values to cards
        allCards.forEach((card, index) => {
            card.setAttribute('data-card-value', shuffled[index]);
            const span = card.querySelector('.card-front span');

            const img = card.querySelector('.card-back img') as HTMLImageElement;

            if(span) span.textContent = shuffled[index];
            if (img) img.src = './images/card-back-blue.png';
            
        });
    }

    handleCardClick(e: Event) {
        const clickedCard = (e.currentTarget as HTMLElement);

        // Prevent clicking if:
        // - currently comparing two cards
        // - card is already flipped
        // - card is already matched
        if (this.isComparing) return;
        if (clickedCard.classList.contains('flipped')) return;
        if (clickedCard.classList.contains('matched')) return;

        // Flip the card
        clickedCard.classList.add('flipped');

        // Check if this is first or second card
        if (!this.firstCard) {
            // This is first card
            this.firstCard = clickedCard;
        } else {
            // This is second card
            this.secondCard = clickedCard;
            this.isComparing = true;

            // Compare the two cards after a delay
            setTimeout(() => this.compareCards(), 1000);
        }
    }

    compareCards() {
        const firstValue = this.firstCard!.getAttribute('data-card-value');
        const secondValue = this.secondCard!.getAttribute('data-card-value');

        if (firstValue === secondValue) {
            // Cards match
            this.firstCard!.classList.add('matched');
            this.secondCard!.classList.add('matched');
            this.matchesFound++;

            // Reset for next attempt
            this.firstCard = null;
            this.secondCard = null;
            this.isComparing = false;

            // Check if player won
            this.checkWin();
        } else {
            // Cards don't match
            this.firstCard!.classList.remove('flipped');
            this.secondCard!.classList.remove('flipped');

            // Reduce attempts
            this.attemptsLeft--;
            this.updateAttemptsDisplay();

            // Reset for next attempt
            this.firstCard = null;
            this.secondCard = null;
            this.isComparing = false;

            // Check if player lost
            this.checkLose();
        }
    }

    checkWin() {
        if (this.matchesFound === 3) {
            // Player found all 3 pairs
            this.winLoseMessage.textContent = 'You Won!';
            this.winLoseMessage.style.display = 'block';

            // Disable all cards so they can't click anymore
            const allCards = document.querySelectorAll('.card');
            allCards.forEach(card => {
                card.classList.add('disabled');
            });
        }
    }

    checkLose() {
        if (this.attemptsLeft === 0 && this.matchesFound < 3) {
            // Player ran out of attempts without finding all pairs
            this.winLoseMessage.textContent = 'Game Over!';
            this.winLoseMessage.style.display = 'block';
            // Diable all cards
            const allCards = document.querySelectorAll('.card');
            allCards.forEach(card => {
                card.classList.add('diabled');
            });
        }
    }

    resetGame() {
        // Reset all game state variables
        this.attemptsLeft = 3;
        this.matchesFound = 0;
        this.firstCard = null;
        this.secondCard = null;
        this.isComparing = false;

        // Update attempts display
        this.updateAttemptsDisplay();

        // Hide win/los message
        this.winLoseMessage.style.display = 'none';

        // Get all cards and reset them
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.remove('flipped', 'matched', 'disabled');
        });

        // Shuffle cards for new game
        this.shuffleCards();
    }
}

new CardMatchGame();