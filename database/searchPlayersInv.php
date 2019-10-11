<?php
$db = mysqli_connect('sql310.epizy.com','epiz_24233037','Tjckfd0Xzrp','epiz_24233037_footplatform') or die('Error connecting to MySQL server.');
function testUtf($param, $ar) {
    $new = array();
    for($i = 0; $i < count($param); $i++) {
        $ar[$param[$i]] = utf8_encode($ar[$param[$i]]);
    }
    return $ar;
}

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

$cahier = checkAp($_POST['typecahier']);
$contrat = checkAp($_POST['typecontrat']);
$inv = checkAp($_POST['inv']);

$joueur = array();
$conditions = array();
$id = array();
$nominv = array();
$compt = 0;
$compt2 = 0;
$nomclub = array();

/*Recupere clubs correspondant aux filtres si pas de club donné*/
$ask = "SELECT id, nom FROM investisseur WHERE id < 10000000 ";
if($inv != '0') {
	$ask .= " AND nom = '$inv' ";
}
$ask .=  ";";

$query = mysqli_query($db, $ask);
if(!$query) {echo "1".mysqli_error($db);}
else{
	while($row = mysqli_fetch_assoc($query)) {
		$id[$compt] = $row['id'];
		$nominv[$compt] = utf8_encode($row['nom']);
		$compt++;
	}
}

$compt = 0;
for($i = 0; $i < count($id); $i++){

	if($cahier == '0' || $cahier == 'prop') {	
		$ask = "SELECT * FROM cahierscharges WHERE identite = '$id[$i]' AND entite = 'investisseur' ";
		if($contrat != '0') {
			$c = 'prop'.$contrat;
			$ask .= " AND typeoffre = '$c' ";
		}
		else{
			$ask .= " AND (typeoffre = 'propsponsor' OR  typeoffre = 'propcapital') ";
		}
		$ask .= ";";
		$query = mysqli_query($db, $ask);
		if(!$query) {echo "3".mysqli_error($db);}
		else{
			while($row = mysqli_fetch_assoc($query)) {
				$joueur[$compt] = testUtf(array('datecreation', 'typeoffre'), $row) ;
				$joueur[$compt]['cahier_id'] = $row['id'];
				$joueur[$compt]['club'] = $nominv[$i];
				$compt++;
			}
		}
	}
}


if($inv == '0'  && $cahier != 'prop') {
	$ask = "SELECT nom FROM club ;";
	$query = mysqli_query($db, $ask);
	if(!$query) {echo "1".mysqli_error($db);}
	else{
		$compt2 = 1;
		while($row = mysqli_fetch_assoc($query)) {
			$nomclub[$compt2] = utf8_encode($row['nom']);
			$compt2++;
		}
	}

	$ask = "SELECT * FROM cahierscharges WHERE idjoueur < 100000000 ";
	if($contrat != '0') {
		$c = 'rech'.$contrat;
		$ask .= " AND typeoffre = '$c' ";
	}
	else{
		$ask .= " AND (typeoffre = 'rechsponsor' OR  typeoffre = 'rechcapital') ";
	}
	$ask .= ";";
	$query = mysqli_query($db, $ask);
	if(!$query) {echo "3".mysqli_error($db);}
	else{
		while($row = mysqli_fetch_assoc($query)) {
			$joueur[$compt] = testUtf(array('datecreation', 'typeoffre'), $row) ;
			$joueur[$compt]['cahier_id'] = $row['id'];
			$joueur[$compt]['club'] = $nomclub[$row['identite']];
			$compt++;
		}
	}
}

for($a = 0; $a < count($joueur); $a++) {
	$newConditions = 'conditions'.$joueur[$a]['typeoffre'];
	$newID = $joueur[$a]['idcond'];
	$query = mysqli_query($db, "SELECT * FROM $newConditions WHERE id = $newID;");
	if(!$query) {echo "5".mysqli_error($db);}
	else{
		if($row = mysqli_fetch_assoc($query)) {
            switch($newConditions) {
                  case 'conditionsrechsponsor' :
                   $conditions[$a] = testUtf(array('nomresp', 'mailresp'), $row) ;
                break;
                case 'conditionsrechcapital' :
                     $conditions[$a] = testUtf(array('nomresp', 'mailresp', 'autreselem'), $row) ;
                break;
                case 'conditionspropsponsor' :
                    $conditions[$a] = testUtf(array('nomresp', 'mailresp'), $row) ;
                break;
                case 'conditionspropcapital' :
                    $conditions[$a] = testUtf(array('nomresp', 'mailresp', 'autreselem'), $row) ;
                break;
            }
		}
	}
}
echo json_encode(array('joueur' => $joueur, 'conditions' => $conditions));
mysqli_close($db);
?>
