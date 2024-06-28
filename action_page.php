<!--Weather form request-->
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $lon = $_POST["lon"];
    $lat = $_POST["lat"];

    echo "<p>Longitude is: $lon</p><br>";
    echo "<p>Latitude is: $lat</p>";
}
?>

