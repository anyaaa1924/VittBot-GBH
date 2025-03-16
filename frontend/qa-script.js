/* qa-script.js */

// Variables to track the user's score and answers
let score = 0;
let answeredQuestions = 0;
const totalQuestions = 5;

// Function to handle answer submission
function submitAnswer(questionNumber, correctAnswer) {
  const userInput = document.getElementById(`answer-${questionNumber}`).value.trim().toLowerCase();
  const feedbackDiv = document.getElementById(`feedback-${questionNumber}`);

  if (userInput === correctAnswer) {
    feedbackDiv.textContent = "Correct!";
    feedbackDiv.style.color = "#4CAF50"; // Green for correct
    score++;
  } else {
    feedbackDiv.textContent = `Wrong! Correct answer: ${correctAnswer}`;
    feedbackDiv.style.color = "#ff4d4d"; // Red for incorrect
  }

  // Disable input and button after submission
  document.getElementById(`answer-${questionNumber}`).disabled = true;
  feedbackDiv.style.fontWeight = "bold";

  answeredQuestions++;
  document.getElementById('score').textContent = score;

  // Show the Finish button when all questions are answered
  if (answeredQuestions === totalQuestions) {
    document.getElementById('finish-btn').style.display = "block";
  }
}

// Function to show hints
function showHint(questionNumber) {
  const hintDiv = document.getElementById(`hint-${questionNumber}`);
  hintDiv.style.display = "block";
}

// Function to show final results
function showFinalResults() {
  const resultsDiv = document.getElementById('results');
  let message = '';

  if (score === totalQuestions) {
    message = "🏅 Gold Medal: Perfect score! You're a financial literacy champion!";
  } else if (score >= totalQuestions / 2) {
    message = "🥈 Silver Medal: Good effort! Keep practicing to master financial literacy!";
  } else if (score > 0) {
    message = "🥉 Bronze Medal: Good start! With more practice, you'll improve!";
  } else {
    message = "😔 Oh-oh! It's okay! You're in the right place to play, learn, and grow!";
  }

  resultsDiv.innerHTML = `<h2>${message}</h2>`;
  alert(message); // Popup message with results
}
