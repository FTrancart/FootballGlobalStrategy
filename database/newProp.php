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
$prop = checkAp($_POST['prop']);
if($entite == 'club') {
	$j = '-1';
}
else if($entite == 'investisseur') {
	$j = '-2';
}
$nomresp = $_POST['nom'];
$mailresp = $_POST['mail'];
switch($type) {
	case 'capital' :
	$ask = mysqli_query($db, "SELECT count(*) FROM conditionspropcapital ;");
	if(!$ask) {echo mysqli_error($db);}
	else{
		while($row = mysqli_fetch_assoc($ask) ){
			$idcond = $row['count(*)'] + 1;
		}

		$ask = mysqli_query($db, "INSERT INTO conditionspropcapital (idinv, nomresp, mailresp, proposition) VALUES ('$id', '$nomresp', '$mailresp','$prop');");
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
	$ask = mysqli_query($db, "SELECT count(*) FROM conditionspropsponsor ;");
	if(!$ask) {echo mysqli_error($db);}
	else{
		while($row = mysqli_fetch_assoc($ask) ){
			$idcond = $row['count(*)'] + 1;
		}
		$ask = mysqli_query($db, "INSERT INTO conditionspropsponsor (idinv, nomresp, mailresp, proposition) VALUES ('$id', '$nomresp', '$mailresp', '$prop');");
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
