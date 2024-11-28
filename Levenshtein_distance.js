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

      // Calculate alignment scores (Levenshtein Distance) for all words
      const scores = dictionary.map(word => ({
        word,
        score: levenshteinDistance(inputWord, word),
      }));

      // Sort by score (ascending, lowest distance is better)
      const sortedScores = scores.sort((a, b) => a.score - b.score);

      // Get the top 10 best matches
      const bestMatches = sortedScores.slice(0, 10);

      // Display results
      resultElement.innerHTML = `
        "${inputWord}" is not found in the dictionary. Best matches are:<br>
        ${bestMatches.map(match => `${match.word} (Score: ${match.score})`).join("<br>")}
      `;
    })
    .catch(err => {
      resultElement.textContent = "Error loading dictionary: " + err.message;
    });
});

// Levenshtein Distance Algorithm
function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}
