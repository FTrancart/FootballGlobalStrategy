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
$club = checkAp($_POST['club']);
$poste = checkAp($_POST['poste']);
$age = $_POST['age'];
$tech = checkAp($_POST['tech']);
$date = $_POST['date'];
$autretech = checkAp($_POST['autre-tech']);
$typepret = checkAp($_POST['typepret']);
$dureepret = checkAp($_POST['dureepret']);
$chargesal = $_POST['chargesal'];
$pourcentsal = checkAp($_POST['pourcentsal']);
$dureecontrat = checkAp($_POST['dureecontrat']);
$salprop = $_POST['sal-prop'];
$devise = $_POST['devise'];
$autreavantage = checkAp($_POST['autre-avantage']);
$montant = $_POST['montant'];
$devisemontant = $_POST['devise-montant'];
$condpaiement = checkAp($_POST['cond-paiement']);
$garantie = $_POST['garantie'];
$condgarantie = checkAp($_POST['cond-garantie']);
$typecond = $_POST['typecond'];
$typeoffre = $_POST['typeoffre'];

$query = mysqli_query($db, "SELECT id FROM club WHERE nom = '$club';");
if(!$query) {
	echo "1:".mysqli_error($db);
}
else{
	$row = mysqli_fetch_assoc($query) ;	
	$idclub = $row["id"];

	$query = mysqli_query($db,  "SELECT count(*) FROM joueur;");
	if(!$query) {
		echo "2:".mysqli_error($db);
	}
	else{

		$query = mysqli_query($db, "SELECT count(*) FROM $typecond;");
		if(!$query ) {
			echo mysqli_error($db);
		}
		else{
			$row = mysqli_fetch_assoc($query) ;	
			$idcond = $row["count(*)"];

			if($typecond == "conditionsdemandetransfert") {
				$query = mysqli_query($db,"INSERT INTO $typecond VALUES('$idcond', '$idclub', '$poste','$age','$tech', '$autretech', '$montant', '$devisemontant', '$condpaiement', '$garantie', '$condgarantie', '$dureecontrat', '$salprop', '$devise', '$autreavantage');");
			}
			else if($typecond == "conditionsdemandepret") {
				$query = mysqli_query($db,"INSERT INTO $typecond VALUES('$idcond', '$idclub', '$poste','$age','$tech', '$autretech', '$typepret', '$dureepret', '$chargesal', '$pourcentsal', '$salprop','$devise', '$autreavantage');");
			}
			else if($typecond == "conditionsdemandelibre") {
				$query = mysqli_query($db,"INSERT INTO $typecond VALUES('$idcond', '$idclub', '$poste','$age','$tech', '$autretech', '$dureecontrat', '$salprop','$devise', '$autreavantage');");
			}
			if(!$query) {
				echo "6".mysqli_error($db);
			}
			else{

					$query = mysqli_query($db,"INSERT INTO cahierscharges (idjoueur, idcond, interet, typeoffre, identite, entite, datecreation) VALUES('-1', '$idcond', 0, '$typeoffre','$idclub', 'club', '$date');");
					if(!$query) {
						echo "7".mysqli_error($db);
					}
					else{
						$query = mysqli_query($db,"SELECT mail FROM responsableclub WHERE idclub = $idclub;");
						if(!$query) {
							echo "7".mysqli_error($db);
						}
						else{
							while($row = mysqli_fetch_assoc($query)) {
                                $mail = utf8_encode($row['mail']);
							
                            }
                            echo json_encode(array("state" => "Registered", "mail" => $mail));
						}
					}
				}
			}
		}
	}
mysqli_close($db);
?>