<?php

$myFile = "general.json";
$fh = fopen($myFile, 'a+') or die("can't open file");
$stringData = $_POST["data"];
fwrite($fh, $stringData);
fclose($fh)

?>