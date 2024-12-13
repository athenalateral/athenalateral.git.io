<?php
// Find the Needleman-Wunsch distance
function needleman_wunsch($seq1, $seq2) {
    $m = strlen($seq1);
    $n = strlen($seq2);

    // Create scoring matrix
    $score = 1;  // match score
    $penalty = -1;  // mismatch and gap penalty

    // Initialize matrix
    $matrix = array();
    for ($i = 0; $i <= $m; $i++) {
        for ($j = 0; $j <= $n; $j++) {
            if ($i == 0) {
                $matrix[$i][$j] = $j * $penalty;
            } elseif ($j == 0) {
                $matrix[$i][$j] = $i * $penalty;
            } else {
                $match = $matrix[$i - 1][$j - 1] + (($seq1[$i - 1] == $seq2[$j - 1]) ? $score : $penalty);
                $insert = $matrix[$i - 1][$j] + $penalty;
                $delete = $matrix[$i][$j - 1] + $penalty;
                $matrix[$i][$j] = max($match, $insert, $delete);
            }
        }
    }

    // Return the final score (edit distance)
    return $matrix[$m][$n];
}

// Load dictionary (this could be a file or a database)
$dictionary = ["apple", "banana", "cherry", "grape", "melon", "orange", "peach", "pear", "plum", "strawberry"]; // Example

// Get input from JavaScript
$data = json_decode(file_get_contents("php://input"));
$input_word = $data->word;

// Compute distances
$distances = [];
foreach ($dictionary as $dict_word) {
    $distance = needleman_wunsch($input_word, $dict_word);
    $distances[] = ['word' => $dict_word, 'distance' => $distance];
}

// Sort by distance
usort($distances, function($a, $b) {
    return $a['distance'] - $b['distance'];
});

// Get the 10 closest words
$closest_words = array_slice($distances, 0, 10);

// Return the result as JSON
header('Content-Type: application/json');
echo json_encode($closest_words);
?>
