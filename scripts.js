// collection of cards
const cards = document.querySelectorAll('.memory-card');

// variables
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// modal window
let modal = document.querySelector('#finish');
let span = document.querySelector('.close');
span.onclick = () => {
  modal.style.display = 'none';
  restartBoard();
}

function flipCard() {
  // return if the board is locked (prevent card flipping before cards are hidden or match)
  if (lockBoard) return;
  
  // return in same card click
  if (this === firstCard) return;

  this.classList.add('flip');
  
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;  

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.species === secondCard.dataset.species;
  isMatch ?  disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);  
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');    
    resetBoard();
  }, 1500);  
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null]
  
  // Check if there are still cards to solve and return
  if (Array.prototype.slice.call(cards).every(card => {
    return Array.prototype.slice.call(card.classList).some(item => {
      return item == 'flip';
    });
  }) == false) return;
  
  // If no more cards show the modal and restart on closing the window
  modal.style.display = 'block';  
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      restartBoard();
    }
  }  
}

function restartBoard() {
  cards.forEach(card => {
    card.classList.remove('flip');    
    card.addEventListener('click', flipCard);
  });
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Randomize cards position based on order property of each element (display: flex sorting rule)
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  })
})();

// add to click event the flip card func
cards.forEach(card => card.addEventListener('click', flipCard));
