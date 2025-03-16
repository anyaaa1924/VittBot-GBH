// Variables to track the user's score and questions
let score = 0;
let answeredQuestions = 0;
const totalQuestions = document.querySelectorAll('.quiz-item').length; // Dynamically get total questions

// Function to handle answer checking
function checkAnswer(button, isCorrect) {
  const quizItem = button.closest('.quiz-item');
  const buttons = quizItem.querySelectorAll('button');
  const feedbackDiv = quizItem.querySelector('.feedback');

  // Check if the question has already been answered
  if (quizItem.dataset.answered) return; // Prevent re-answering

  // Mark the question as answered
  quizItem.dataset.answered = true;

  // Disable all buttons for the current question
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.style.cursor = 'not-allowed';
  });

  // Provide feedback based on the answer
  if (isCorrect) {
    button.style.backgroundColor = '#4CAF50'; // Green for correct answer
    button.style.color = 'white';
    feedbackDiv.textContent = 'Correct!';
    feedbackDiv.style.color = '#4CAF50';
    score++; // Increase score
  } else {
    button.style.backgroundColor = '#ff4d4d'; // Red for incorrect answer
    button.style.color = 'white';
    feedbackDiv.textContent = 'Wrong!';
    feedbackDiv.style.color = '#ff4d4d';
  }

  // Increment the answered questions count
  answeredQuestions++;
  document.getElementById('score').textContent = `${score} / ${totalQuestions}`;

  // Check if all questions are answered to enable the finish button
  if (answeredQuestions === totalQuestions) {
    document.getElementById('finish-btn').style.display = 'block';
  }
}

// Function to show final results
function showFinalResults() {
  const resultsDiv = document.getElementById('results');
  let message = '';

  // Display results based on score
  if (score === totalQuestions) {
    message = "🏅 Gold Medal: Perfect score! You're a financial literacy champion!";
  } else if (score >= totalQuestions / 2) {
    message = "🥈 Silver Medal: Good going! A little more practice and you'll master financial literacy!";
  } else if (score > 0) {
    message = "🥉 Bronze Medal: Good start! Keep practicing and you'll master this!";
  } else {
    message = "😔 Oh-oh! It's okay! You're at the right place—play, learn, and become financially literate!";
  }

  // Show the results
  resultsDiv.innerHTML = `<h2>${message}</h2>`;
  alert(message); // Optionally show an alert popup
}
