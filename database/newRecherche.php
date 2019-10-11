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
$offre = $_POST['offre'];
$id = $_POST['id-ent'];
$entite = $_POST['entite'];
$date = $_POST['date'];
if($entite == 'club') {
	$j = '-1';
}
else if($entite == 'investisseur') {
	$j = '-2';
}
$nomresp = checkAp($_POST['nom']);
$mailresp = checkAp($_POST['mail']);
$typecond = $_POST['typecond'];
switch($type) {
	case 'capital' :
	$aug = $_POST['augmentation'];
	$cespart = $_POST['cession'];
	$cestot = $_POST['cessiontotale'];
	$autre = $_POST['elemautre'];
	$ask = mysqli_query($db, "SELECT count(*) FROM $typecond ;");
	if(!$ask) {echo mysqli_error($db);}
	else{
		while($row = mysqli_fetch_assoc($ask) ){
			$idcond = $row['count(*)'] + 1;
		}

		$ask = mysqli_query($db, "INSERT INTO $typecond VALUES ('$idcond', '$id', '$nomresp', '$mailresp', '".$aug['nombre']."', '".$aug['nominatif']."','".$aug['total']."','".$cespart['nombre']."', '".$cespart['nominatif']."','".$cespart['total']."','".$cestot['nombre']."', '".$cestot['nominatif']."','".$cestot['total']."', '".$autre."');");
		if(!$ask) {echo "1".mysqli_error($db);}
		else{
			$ask = mysqli_query($db, "INSERT INTO cahierscharges (idjoueur, idcond, interet, typeoffre, identite, entite) VALUES ('$j', '$idcond', '0', '$offre', '$id', '$entite');");
			if(!$ask) {echo "2".mysqli_error($db);}
			else{
				$res = array('state' => 'Registered', 'mail' => $mailresp);
				echo json_encode($res);
			}
		}
	}
	break;
	case 'sponsor':
	$naming = $_POST['naming'];
	$maillots = $_POST['maillots'];
	$fixes = $_POST['fixes'];
	$mobiles = $_POST['mobiles'];
	$tribunes = $_POST['tribunes'];
	$site = $_POST['site'];
	$loges = $_POST['loges'];
	$ask = mysqli_query($db, "SELECT count(*) FROM $typecond ;");
	if(!$ask) {echo mysqli_error($db);}
	else{
		while($row = mysqli_fetch_assoc($ask) ){
			$idcond = $row['count(*)'] + 1;
		}
		$ask = mysqli_query($db, "INSERT INTO $typecond VALUES ('$idcond', '$id', '$nomresp', '$mailresp', '".$naming['cond']."', '".$naming['duree']."', '".$naming['budget']."', '".$maillots['cond']."', '".$maillots['duree']."', '".$maillots['budget']."', '".$fixes['cond']."', '".$fixes['duree']."', '".$fixes['budget']."', '".$mobiles['cond']."','".$mobiles['duree']."', '".$mobiles['budget']."', '".$tribunes['cond']."', '".$tribunes['duree']."','".$tribunes['budget']."', '".$site['cond']."', '".$site['duree']."', '".$site['budget']."', '".$loges['cond']."', '".$loges['duree']."', '".$loges['budget']."');");
		if(!$ask) {echo mysqli_error($db);}
		else{
			$ask = mysqli_query($db, "INSERT INTO cahierscharges (idjoueur, idcond, interet, typeoffre, identite, entite, datecreation) VALUES ('$j', '$idcond', '0', '$offre', '$id', '$entite', '$date');");
			if(!$ask) {echo mysqli_error($db);}
			else{
				$res = array('state' => 'Registered', 'mail' => $mailresp);
				echo json_encode($res);
			}
		}
	}
	break;
	default:
	echo "Type d'acteur inconnu dans création de cahier de recherche";
	break;
}
mysqli_close($db);
?>
