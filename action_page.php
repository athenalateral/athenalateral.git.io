<!DOCTYPE html>
<html>
    <head>Weather</head>

<body>
    
<p>Something is happening</p>
<?php
    if ($_SERVER["REQUEST_METHOD"] == "GET") {
        $lon = $_GET['lon'];
        $lat = $_GET['lat'];
    
        echo "<p>Longitude is: $lon</p><br>";
        echo "<p>Latitude is: $lat</p>";

        //My hope is that this will pull the info from the website but probably not
        $url = 'https://api.weather.gov/gridpoints/TOP/$lat,$lon/forecast';

        $json = file_get_contents($url);

        $data = json_decode($json, true);

        if($data) {
            echo "<h2>Weather Data:</h2>";

        }
        else {
            echo "<p>you did it wrong :(</p>";
        }

    }
?>
        
</body>
</html>
