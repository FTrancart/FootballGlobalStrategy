<?php 
$db = mysqli_connect('sql310.epizy.com','epiz_24233037','Tjckfd0Xzrp','epiz_24233037_footplatform') or die('Error connecting to MySQL server.');
$arrayC = array();
$mode = $_POST['mode'];
$arrayI = array();
$array = array();
$query = mysqli_query($db, "SELECT * FROM cahierscharges ORDER BY id DESC LIMIT 20;");
if(!$query) {
	echo "1:".mysqli_error($db);
}
else{
	$compt = 0;
    $compt2 = 0;
	while($row = mysqli_fetch_assoc($query)) {
		switch($row['typeoffre']) {
			case 'propsponsor' : 
			$row['typeoffre2'] = "Proposition de sponsoring";
			break;
			case 'propcapital' : 
			$row['typeoffre2'] = "Proposition d'entrée en capital";
			break;
			case 'rechsponsor' : 
			$row['typeoffre2'] = "Recherche de sponsoring";
			break;
			case 'rechcapital' : 
			$row['typeoffre2'] = "Recherche d'entrée en capital";
			break;
			case 'transfert' : 
			$row['typeoffre2'] = "Offre de transfert";
			break;
			case 'pret' : 
			$row['typeoffre2'] = "Offre de prêt";
			break;
			case 'joueurlibre' : 
			$row['typeoffre2'] = "Offre de joueur libre";
			break;
			case 'demandepret' : 
			$row['typeoffre2'] = "Demande de prêt";
			break;
			case 'demandelibre' : 
			$row['typeoffre2'] = "Demande de joueur libre";
			break;
			case 'demandetransfert' : 
			$row['typeoffre2'] = "Demande de transfert";
			break;
		}
		$array[$compt] = array('ID' => $row['id'], 'Type' => $row['typeoffre2'], 'Date' => utf8_encode($row['datecreation']));
		$type = utf8_encode($row['entite']);
		$id = $row['identite']; 

		$query2 = mysqli_query($db, "SELECT nom FROM $type where id = $id;");
		if(!$query2) {
			echo "1:".mysqli_error($db);
		}
		else{
			while($row2 = mysqli_fetch_assoc($query2)) {
				$array[$compt]['Emetteur'] = utf8_encode($row2['nom'])." (".utf8_encode($row['entite']).")";
				if($type == 'club') {
                    if($mode == 'investisseur') {
                        if($row['typeoffre'] == "rechsponsor" || $row['typeoffre'] == "rechcapital") {
                            $arrayC[$compt] = $array[$compt];
                            $compt++;
                        }
                    }
                    else{
					$arrayC[$compt] = $array[$compt];
                    $compt++;
                    }
				}
				else if($type == 'investisseur') {
					$arrayI[$compt2] = $array[$compt];
                    $compt2++;
				}
			}	
		}
		
	}
}
echo json_encode(array('club' => $arrayC, 'inv' => $arrayI));
mysqli_close($db);
?>