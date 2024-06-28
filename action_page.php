<!--Weather form request-->
<?php

if($_SERVER("REQUEST_METHOD")=="POST")
{
  $lon=$_POST("lon");
	$lat=$_POST("lat");

  echo "<p>longitude is: </p><br>";
  echo "<p>latitude is: </p>";
  
}

?>
