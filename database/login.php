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
function testTable($table, $entite, $db) {
	$user = checkAp($_GET['username']);
	$pass = checkAp($_GET['password']);
	$type = 0;
	$resp = array();
	$joueurs = array();
    $res = array();
	$c = 0;

	$query = mysqli_query($db, "SELECT nom, id, count(*) FROM $table WHERE username = '$user' AND password = '$pass';");
	if(!$query) {
		echo mysqli_error($db);
	}
	else{
		while($row = mysqli_fetch_assoc($query)) {
			if($row['count(*)'] > 0) {
				$array = array('nb' => $row["count(*)"], 'nom' => $row["nom"], 'type' => $table, 'id' => $row['id']);
				$id = $row['id'];

				$query = mysqli_query($db, "SELECT nom FROM correspondant WHERE identite = '$id' AND entite = '$entite';");
				if(!$query) {echo mysqli_error($db);}
				else{
					$row = mysqli_fetch_assoc($query);
					$nomcorres = utf8_encode($row['nom']);

					switch($table) {
						case 'club': 
						$query = mysqli_query($db, "SELECT nom FROM responsableclub WHERE idclub = '$id';");
						if(!$query) {echo mysqli_error($db);}
						else{
							while($row = mysqli_fetch_assoc($query))
							{
								$resp[$c] = utf8_encode($row['nom']);
								$c++;
							}
							$c=0;

							$query2 = mysqli_query($db, "SELECT nom FROM joueur WHERE id IN (SELECT idjoueur FROM cahierscharges WHERE identite = '$id' AND entite = 'club');");
							if(!$query2) {echo mysqli_error($db);}
							else{
								while($row = mysqli_fetch_assoc($query2))
								{
									$joueurs[$c] = utf8_encode($row['nom']);
									$c++;
								}
                                $res = json_encode(array('entite' => $array, 'respos' => $resp, 'corres' => $nomcorres, 'joueurs' => $joueurs));   
								echo $res;
							}
						}
						break;
						case 'investisseur' :
						$query = mysqli_query($db, "SELECT id , interet FROM cahierscharges WHERE identite = '$id' AND entite = '$entite' AND typeoffre='propcapital';");
						if(!$query) {echo mysqli_error($db);}
						else{
							$compt =0;
							$idcahierscap = array();
							while($row = mysqli_fetch_assoc($query))
							{
								$idcahierscap[$compt] = $row["id"];
								$compt++;
							}
							$query = mysqli_query($db, "SELECT id , interet FROM cahierscharges WHERE identite = '$id' AND entite = '$entite' AND typeoffre='propsponsor';");
							if(!$query) {echo mysqli_error($db);}
							else{
								$compt =0;
								$idcahierssponsor = array();
								while($row = mysqli_fetch_assoc($query))
								{
									$idcahierssponsor[$compt] = $row["id"];
									$compt++;
								}
								echo json_encode(array('entite' => $array,'corres' => $nomcorres, 'cahierscap' => $idcahierscap, 'cahierssponsor' => $idcahierssponsor));
							}
						}
						break;
					}

				}
				return 1;
			}
			else{
				if($table == 'investisseur') {
					$array = array();
					$array['nb'] = 0;
					echo json_encode(array('entite' => $array));
				}
				return 0;
			}
		}
	}
}
$res = testTable('club', 'Club', $db);
if($res != 1) {
	$res = testTable('investisseur', 'investisseur', $db);
}

mysqli_close($db);

?>
