<?php 
$db = mysqli_connect('sql310.epizy.com','epiz_24233037','Tjckfd0Xzrp','epiz_24233037_footplatform') or die('Error connecting to MySQL server.');
function checkAp($string) {
    $res = $string;
    for($i = 0 ; $i < strlen($string); $i++) {
        if($string[$i] == "'") {
            $rest = substr($string, $i + 1, strlen($string));
            $res = substr($string, 0 , $i + 1)."'".$rest;
        }    
    }
    return $res;
}
$id = $_POST['idcahier'];
$nom = $_POST['nom'];
$type = $_POST['type'];
$prop = checkAp($_POST['contreprop']);

switch($type) {
	case 'club':
	$query = mysqli_query($db, "SELECT mail FROM responsableclub WHERE idclub = (SELECT id FROM club where nom = '$nom');");
	break;
	case 'investisseur':
	$query = mysqli_query($db, "SELECT mail FROM investisseur WHERE nom = '$nom';");
	break;
	default :
	echo 'Entité non reconnue';
	break;
}
if(!$query) {
	echo mysqli_error($db);
}
else{
	$row = mysqli_fetch_assoc($query) ;	
	$mail = $row["mail"];
    echo "INSERT INTO interet (type, nom, mail, idcahier, contreprop) VALUES ('$type', '$nom', '$mail', '$id', '$prop');";
	$query = mysqli_query($db, "INSERT INTO interet (type, nom, mail, idcahier, contreprop) VALUES ('$type', '$nom', '$mail', '$id', '$prop');");
	if(!$query) {
		echo mysqli_error($db);
	}
	else{
		echo "Updated";
	}
}
mysqli_close($db);
?>