<?php
$db = mysqli_connect('sql310.epizy.com','epiz_24233037','Tjckfd0Xzrp','epiz_24233037_footplatform') or die('Error connecting to MySQL server.');

$ask = mysqli_query($db, "SELECT count(*) from cahierscharges;");
if(!$ask) {echo mysqli_error($db);}
else{
	while($row = mysqli_fetch_assoc($ask)) {
	$id = $row['count(*)'];
    }
}

$content = $_POST['data'];
$file = 'cahier'.$id.'.txt';
$pdf = fopen($file , 'w');
fwrite($pdf, $content);
fclose($pdf);
echo 'Saved';
mysqli_close($db);
?>