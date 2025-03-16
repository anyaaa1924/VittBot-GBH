// Google Translate setup to handle the dynamic translation
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,hi,kn,ta,te,ml,mr,gu,pa,or',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}

// Function to handle language change based on Google Translate
function changeLanguage() {
  const selectedLang = document.getElementById('language-selector').value;
  const langCode = selectedLang || 'en'; // Default to English if no language is selected
  window.location.search = `?lang=${langCode}`;
}

// Search Functionality to search site content
function searchSite() {
  const query = document.getElementById('search-bar').value.toLowerCase();
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const sectionText = section.innerText.toLowerCase();
    if (sectionText.includes(query)) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });
}

// Loan calculation function
function calculateLoanRepayment() {
  const amount = document.getElementById('loan-repayment-amount').value;
  const interest = document.getElementById('loan-repayment-interest').value;
  const years = document.getElementById('loan-repayment-years').value;

  if (amount && interest && years) {
    const monthlyRate = interest / 100 / 12;
    const payments = years * 12;
    const x = Math.pow(1 + monthlyRate, payments);
    const monthly = (amount * x * monthlyRate) / (x - 1);
    const totalRepayment = monthly * payments;

    const result = document.getElementById('loan-repayment-result');
    result.innerHTML = `
      <h3>Loan Repayment Details</h3>
      <p><strong>Monthly Payment:</strong> ₹${monthly.toFixed(2)}</p>
      <p><strong>Total Repayment Amount:</strong> ₹${totalRepayment.toFixed(2)}</p>
    `;
  } else {
    alert('Please fill in all fields!');
  }
}

// Credit score calculation function
function calculateCreditScore() {
  const score = document.getElementById('credit-score').value;
  const result = document.getElementById('credit-score-result');
  let message = '';

  if (score >= 300 && score <= 579) {
    message = `<h3>Credit Score: Poor</h3><p>Your credit score is poor. You may face difficulty in getting loans.</p>`;
  } else if (score >= 580 && score <= 669) {
    message = `<h3>Credit Score: Fair</h3><p>Your credit score is fair. You may still be able to get loans.</p>`;
  } else if (score >= 670 && score <= 739) {
    message = `<h3>Credit Score: Good</h3><p>Your credit score is good. You're likely to get favorable loan terms.</p>`;
  } else if (score >= 740 && score <= 799) {
    message = `<h3>Credit Score: Very Good</h3><p>Your credit score is very good. You're likely to get the best loan offers.</p>`;
  } else if (score >= 800 && score <= 850) {
    message = `<h3>Credit Score: Excellent</h3><p>Your credit score is excellent. You may also get higher credit limits.</p>`;
  } else {
    message = `<h3>Invalid Score</h3><p>Please enter a valid credit score between 300 and 850.</p>`;
  }

  result.innerHTML = message;
}
