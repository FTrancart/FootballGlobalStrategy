<?php
$db = mysqli_connect('sql310.epizy.com','epiz_24233037','Tjckfd0Xzrp','epiz_24233037_footplatform') or die('Error connecting to MySQL server.');
function testUtf($param, $ar) {
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

$club = checkAp($_POST['entite']);
$max = $_POST['max'];
$offre = checkAp($_POST['offre']);
$conf = checkAp($_POST['conf']);
$pays = checkAp($_POST['pays']);
$champ = checkAp($_POST['champ']);
$poste = checkAp($_POST['poste']);
$type = checkAp($_POST['typecahier']);
$typeprop =checkAp($_POST['typeprop']);
$showprop = $_POST['showprop'];

$array = array();
$id = array();
$idjoueur = array();
$tab = array();
$arrayclub = array();
$joueur = array();
$conditions = array();
$compt = 0;
$compt2 = 0;

function testNA($elem, $asktest, $param) {
	if($elem != '0') {
		$asktest .= " AND $param = '$elem' ";
	}
	return $asktest;
}
/*Recupere clubs correspondant aux filtres si pas de club donné*/
$ask = "SELECT id, nom FROM club WHERE id < 10000000 ";
$ask = testNA($champ, $ask, 'ligue');
$ask = testNA($conf, $ask, 'conference');
$ask = testNA($pays, $ask, 'pays');
$ask = testNA($club, $ask, 'nom');
$ask .=  ";";

$query = mysqli_query($db, $ask);
if(!$query) {echo "1".mysqli_error($db);}
else{
	while($row = mysqli_fetch_assoc($query)) {
		$id[$compt] = $row['id'];
		$arrayclub[$compt] = utf8_encode($row['nom']);
		$compt++;
	}
}

for($i = 0; $i < count($id); $i++){
	if($type == '0' || $type == 'demande') {
		$ask = "SELECT * FROM cahierscharges WHERE idjoueur = -1 AND identite = '$id[$i]' AND entite = 'club' ";
		if($offre != '0') {
			$t = "demande".$offre;
			$ask .= " AND typeoffre = '$t' ";
		}
		$ask .= ";";
		$query = mysqli_query($db, $ask);
		if(!$query) {echo "2".mysqli_error($db);}
		else{
			while($row = mysqli_fetch_assoc($query)) {
				$joueur[$compt2] = testUtf(array('typeoffre', 'datecreation'), $row) ;
				$joueur[$compt2]['club'] = $arrayclub[$i];
				$joueur[$compt2]['cahier_id'] = $row['id'];
				$compt2++;
			}
		}
	}
	if($type == '0' || $type == 'offre') {
		$ask = "SELECT *, cahierscharges.idjoueur, cahierscharges.typeoffre, cahierscharges.id, cahierscharges.idcond FROM joueur INNER JOIN cahierscharges ON joueur.id = cahierscharges.idjoueur WHERE joueur.id >= 0 AND cahierscharges.identite ='$id[$i]' AND entite = 'club' ";
		$ask = testNA($poste, $ask, 'joueur.poste');
		$ask = testNA($offre, $ask, 'cahierscharges.typeoffre');
		$query = mysqli_query($db, $ask);
		if(!$query) {echo "3".mysqli_error($db);}
		else{
			while($row = mysqli_fetch_assoc($query)) {
				$joueur[$compt2] = testUtf(array('typeoffre', 'datecreation', 'nom', 'lieunaissance', 'nationalite', 'poste'), $row) ;
				$joueur[$compt2]['club'] = $arrayclub[$i];
				$joueur[$compt2]['cahier_id'] = 0;
				$joueur[$compt2]['type'] = 'offre';
				$compt2++;
			}
		}
	}

	if($showprop == 'oui') {
		$ask = "SELECT *, investisseur.nom FROM cahierscharges INNER JOIN investisseur ON cahierscharges.identite = investisseur.id WHERE idjoueur = -2 ";
		$ask = testNA($typeprop, $ask, 'typeoffre');
		$ask .= ";";
		$query = mysqli_query($db, $ask);
		if(!$query) {echo "4".mysqli_error($db);}
		else{
			while($row = mysqli_fetch_assoc($query)) {
				$joueur[$compt2] = testUtf(array('typeoffre', 'datecreation', 'nom', 'nationalite', 'username', 'password', 'type', 'domaine', 'objectif', 'mail'), $row) ;
				$joueur[$compt2]['cahier_id'] = $row['id'];
				$joueur[$compt2]['club'] = utf8_encode($row['nom']);
				$compt2++;
			}
		}
	}
}

for($a = 0; $a < count($joueur); $a++) {
	$newConditions = 'conditions'.$joueur[$a]['typeoffre'];
	$newID = $joueur[$a]['idcond'];
	$query = mysqli_query($db, "SELECT * FROM $newConditions WHERE id = $newID;");
	if(!$query) {echo "5".mysqli_error($db);}
	else{
		while($row = mysqli_fetch_assoc($query)) {
            switch($newConditions) {
                case 'conditionstransfert' :
                    $conditions[$a] = testUtf(array('destinations', 'duree'), $row);
                break;
                case 'conditionspret' :
                    $conditions[$a] = testUtf(array('typepret', 'dureepret', 'conditionsachat', 'conditionssalaire', 'destinations', 'duree', 'autre'), $row);
                break;
                case 'conditionsjoueurlibre' :
                    $conditions[$a] = testUtf(array('destinations', 'duree', 'autre'), $row);
                break;
                case 'conditionsdemandetransfert' :
                    $conditions[$a] = testUtf(array('poste', 'age','technique', 'autretech','conditionspaiement', 'conditionsgarantie', 'duree', 'autre'), $row);
                break;
                case 'conditionsdemandepret' :
                   $conditions[$a] = testUtf(array('poste', 'age','technique', 'autretech','typepret', 'dureepret', 'pourcentsal', 'autre'), $row) ;
                break;
                case 'conditionsdemandelibre' :
                    $conditions[$a] = testUtf(array('poste', 'age','technique', 'autretech', 'duree', 'autre'), $row);
                break;
                case 'conditionsrechsponsor' :
                   $conditions[$a] = testUtf(array('nomresp', 'mailresp'), $row);
                break;
                case 'conditionsrechcapital' :
                     $conditions[$a] = testUtf(array('nomresp', 'mailresp', 'autreselem'), $row);
                break;
                case 'conditionspropsponsor' :
                    $conditions[$a] = testUtf(array('nomresp', 'mailresp'), $row);
                break;
                case 'conditionspropcapital' :
                    $conditions[$a] = testUtf(array('nomresp', 'mailresp', 'autreselem'), $row);
                break;
                default : 
                echo "Conditions non reconnues";
                break;
		}
	}
}
}
echo json_encode(array('joueur' => $joueur, 'conditions' => $conditions));
mysqli_close($db);
?>
