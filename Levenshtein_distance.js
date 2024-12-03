document.getElementById("spell-checker-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const inputWord = document.getElementById("word-input").value.trim().toLowerCase();
  const resultElement = document.getElementById("result");

  if (!inputWord) {
    resultElement.textContent = "Please enter a word.";
    return;
  }

  // Load the dictionary file
  fetch("dictionary.txt")
    .then(response => response.text())
    .then(data => {
      // Parse the dictionary into an array of words
      const dictionary = data.split(/\r?\n/).map(word => word.trim().toLowerCase());

      // Calculate alignment scores with custom penalties
      const scores = dictionary.map(word => ({
        word,
        score: levenshteinDistanceWithPenalties(inputWord, word),
      }));
      
      // Sort and get top 10 matches
      const sortedScores = scores.sort((a, b) => a.score - b.score);
      const bestMatches = sortedScores.slice(0, 10);

      // Display results
      resultElement.innerHTML = `
        "${inputWord}". Best matches are:<br>
        ${bestMatches.map(match => `${match.word} (Score: ${match.score})`).join("<br>")}
      `;
    })
    .catch(err => {
      resultElement.textContent = "Error loading dictionary: " + err.message;
    });
});

// Levenshtein Distance Algorithm
function levenshteinDistanceWithPenalties(a, b) {
  const isVowel = char => "aeiou".includes(char.toLowerCase());

  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  // Initialize the first row and column with gap penalties
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i * 2; // Gap penalty = 2
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j * 2; // Gap penalty = 2

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const charA = a[i - 1];
      const charB = b[j - 1];

      let cost;
      if (charA === charB) {
        cost = 0; // Exact match = 0
      } else if (isVowel(charA) === isVowel(charB)) {
        cost = 1; // Consonant/Consonant or Vowel/Vowel mismatch = 1
      } else {
        cost = 3; // Vowel/Consonant mismatch = 3
      }

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 2, // Deletion (gap penalty = 2)
        matrix[i][j - 1] + 2, // Insertion (gap penalty = 2)
        matrix[i - 1][j - 1] + cost // Substitution with custom cost
      );
    }
  }

  return matrix[a.length][b.length];
}
