// FLIP PAGE
function showInfographic() {
  document.getElementById("infographic").style.display = "block";
  document.getElementById("card-container").style.display = "none";
  highlightButton("infographic");
}

function showCard() {
  document.getElementById("infographic").style.display = "none";
  document.getElementById("card-container").style.display = "flex";
  highlightButton("card");
}

function highlightButton(active) {
  const infoBtn = document.getElementById("btn-infographic");
  const cardBtn = document.getElementById("btn-card");

  if (active === "infographic") {
    infoBtn.classList.add("active-button");
    cardBtn.classList.remove("active-button");
  } else {
    cardBtn.classList.add("active-button");
    infoBtn.classList.remove("active-button");
  }
}

// default view: hide both
window.onload = () => {
  document.getElementById("infographic").style.display = "none";
  document.getElementById("card-container").style.display = "none";

  // remove active class from both buttons
  document.getElementById("btn-infographic").classList.remove("active-button");
  document.getElementById("btn-card").classList.remove("active-button");
};


// MATCH PAGE
// drag and drop setup
document.querySelectorAll('.draggable').forEach(el => {
  el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', e.target.id);
  });
});

document.querySelectorAll('.droppable').forEach(el => {
  el.addEventListener('dragover', e => e.preventDefault());
  el.addEventListener('drop', e => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text');
    const draggedText = document.getElementById(draggedId).textContent;

    const slot = el.querySelector('.answer-slot');
    slot.textContent = draggedText;
    el.setAttribute('data-answer', draggedId);
    slot.style.backgroundColor = '#fffbe0'; // subtle highlight
  });
});

// quiz setup
function resetQuiz() {
  // clear all answer slots and remove answer data
  document.querySelectorAll('.droppable').forEach(el => {
  el.removeAttribute('data-answer');
  const slot = el.querySelector('.answer-slot');
  slot.textContent = '--Drop here--';
  slot.style.backgroundColor = ''; // reset background
  }); 

  //scroll back to top after reset
  window.scrollTo(0, 0);
}

// check answers function
function checkAnswers() {
  const droppables = document.querySelectorAll('.droppable');
  const total = droppables.length;
  let score = 0;

  const unanswered = [...droppables].some(el => !el.getAttribute('data-answer'));
  if (unanswered) {
    alert("Not done yet! Just a few more matches to go!");
    return;
  }

  let reviewHTML = '';

  droppables.forEach(el => {
    const correct = el.getAttribute('data-match');
    const userAnswer = el.getAttribute('data-answer');
    const questionText = el.querySelector('.question-text').textContent;
    const answerText = el.querySelector('.answer-slot').textContent;

    const isCorrect = correct === userAnswer;
    if (isCorrect) score++;

    reviewHTML += `
      <div class="${isCorrect ? 'correct' : 'wrong'}">
        <strong>Que:</strong> ${questionText} <br>
        <strong>Your Answer:</strong> ${answerText}
        ${!isCorrect ? `<br><strong>Correct Answer:</strong> ${document.getElementById(correct).textContent}` : ''}
      </div>
    `;
  });

  // save to sessionStorage
  sessionStorage.setItem('quizScore', score);
  sessionStorage.setItem('quizTotal', total);
  sessionStorage.setItem('quizReview', reviewHTML);

  // redirect to result page
  window.location.href = 'result.html';
}

// SCORE PAGE
const score = sessionStorage.getItem('quizScore');
const total = sessionStorage.getItem('quizTotal');
let reviewHTML = sessionStorage.getItem('quizReview');

// wrap correct answers in a hidden span
reviewHTML = reviewHTML.replace(/<br><strong>Correct Answer:.*?<\/strong>/g, match => {
  return `<span class="hidden-correct-answer">${match}</span>`;
});

document.getElementById('final-score').textContent = `You Scored: ${score} / ${total}`;
document.getElementById('answer-review').innerHTML = reviewHTML;

// show or hide answer function
function toggleAnswers() {
  const answers = document.querySelectorAll('.hidden-correct-answer');
  const btn = document.getElementById('toggle-btn');
  const isHidden = answers[0].style.display === 'none';

  answers.forEach(el => {
    el.style.display = isHidden ? 'inline' : 'none';
  });

  btn.textContent = isHidden ? 'Hide Correct Answers' : 'Reveal Correct Answers';
}