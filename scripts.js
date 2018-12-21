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

  // If no more cards congratulate!!! and restart on closing the window
  confetti();
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
  killConfetti();
  shuffle();
}

// Randomize cards position based on order property of each element (display: flex sorting rule)
function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  })
}

// add to click event the flip card func
cards.forEach(card => card.addEventListener('click', flipCard));

// call shuffle
shuffle();

// Confetti generator
function confetti() {
  for(i=0; i<200; i++) {
    // Random rotation
    var randomRotation = Math.floor(Math.random() * 360);
    // Random width & height between 0 and viewport
    var randomWidth = Math.floor(Math.random() * Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
    var randomHeight =  Math.floor(Math.random() * Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    
    // Random animation-delay
    var randomAnimationDelay = Math.floor(Math.random() * 10);
    console.log(randomAnimationDelay)
  
    // Random colors
    var colors = ['#0CD977', '#FF1C1C', '#FF93DE', '#5767ED', '#FFC61C', '#8497B0']
    var randomColor = colors[Math.floor(Math.random() * colors.length)];
  
    // Create confetti piece
    var confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.top = randomHeight + 'px';
    confetti.style.left = randomWidth + 'px';
    confetti.style.backgroundColor = randomColor;
    confetti.style.transform = 'skew(15deg) rotate(' + randomRotation + 'deg)';
    confetti.style.animationDelay = randomAnimationDelay + 's';
    document.getElementById("confetti-wrapper").appendChild(confetti);
  }
}

function killConfetti() {
  var confetti = document.querySelectorAll('.confetti');
  confetti.forEach(item => {
    // Random animation-delay
    var randomAnimationDelay = Math.floor(Math.random() * 10);
    console.log(randomAnimationDelay)
    // Remove confetti piece
    item.remove();
  })  
}
