/* play-script.js */

// Optional: Welcome message on page load
window.onload = function() {
  alert("Welcome to the Play and Learn section! Pick a game to start sharpening your financial skills!");
};

// Adding hover effects dynamically for Play Now buttons
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = "#4f5ff0"; // Green on hover
    button.style.color = "white"; // Adjust text color if necessary
  });

  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = "#6da1e6"; // Original color
    button.style.color = "white"; // Ensure consistency
  });
});

// Smooth navigation if you want to add more interactive sections in the future
function navigateToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}
