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
$type = $_POST['type'];
$nom = checkAp($_POST['nom']);
$nationalite = checkAp($_POST['nationalite']);
$mandat = $_POST['mandat'];
$mandant = checkAp($_POST['mandant']);
$domaine = checkAp($_POST['domaine']);
$nomresp = checkAp($_POST['nomresp']);
$mailresp = checkAp($_POST['mailresp']);
$telresp = $_POST['telresp'];
$obj = checkAp($_POST['obj']);
$fct = checkAp($_POST['fct']);
$user = checkAp($_POST['user']);
$pass = checkAp($_POST['pass']);
$mail = checkAp($_POST['mail']);

/*On cherche l'id pour le prochain element*/
$ask = mysqli_query($db, "SELECT count(*) from investisseur;");
if(!$ask) {echo mysqli_error($db);}
else{
	$row = mysqli_fetch_assoc($ask) ;
	$id = $row['count(*)'] + 1;

	$ask = mysqli_query($db, "SELECT count(*) from correspondant;");
	if(!$ask) {echo mysqli_error($db);}
	else{
		$row = mysqli_fetch_assoc($ask) ;
		$id2 = $row['count(*)'] + 1;

		/*Si pas d'erreur on enregistre le nouveau element*/
		$query = mysqli_query($db, "INSERT INTO investisseur VALUES ('$id', '$id2','$nom', '$user', '$pass', '$type', '$nationalite', '$mandat', '$domaine',  '$obj', '$mail');");
		if(!$query) {echo mysqli_error($db);}
		else{
			$query = mysqli_query($db, "INSERT INTO correspondant VALUES ('$id2', '$id', '$nomresp', '$fct','$mailresp', '$telresp', 'Investisseur');");
			if(!$query) {echo mysqli_error($db);}
			else{
				echo "Registered";
			}
		}
	}
}

mysqli_close($db);
?>