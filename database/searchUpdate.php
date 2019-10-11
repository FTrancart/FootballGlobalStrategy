<?php
$db = mysqli_connect('sql310.epizy.com','epiz_24233037','Tjckfd0Xzrp','epiz_24233037_footplatform') or die('Error connecting to MySQL server.');

function getParam($param, $table, $db) {
	$array = array();
	$compt = 0;
	$query = mysqli_query($db, "SELECT DISTINCT $param FROM $table;");
	if(!$query) {echo mysqli_error($db);}
	else{
		while($row = mysqli_fetch_assoc($query)) {
			$array[$compt] = utf8_encode($row[$param]);
			$compt++;
		}
	}
	return $array;
}

$conf = getParam("conference", "club", $db);
$pays = getParam("pays", "club", $db);
$champ =  getParam("ligue", "club", $db);
$nom = getParam("nom", "club", $db);
if($_POST['club'] == '0') {
	$poste = getParam("poste", "joueur", $db);
}
else{
	$club = $_POST['club'];
	$query = mysqli_query($db, "SELECT DISTINCT poste FROM joueur WHERE idclub = (SELECT id FROM club where nom = '$club');");
	if(!$query) {echo mysqli_error($db);}
	else{
		$compt = 0;
		while($row = mysqli_fetch_assoc($query)) {
			$poste[$compt] = utf8_encode($row['poste']);
			$compt++;
		}
	}
}
echo json_encode(array($conf, $pays, $champ, $nom, $poste));
mysqli_close($db);
?>
