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
$conf = checkAp($_POST['conf']);
$affil = $_POST['affil'];
$fifa = checkAp($_POST['fifa']);
$pays = checkAp($_POST['pays']);
$ligue = checkAp($_POST['ligue']);
$club = checkAp($_POST['club']);
$corresmail = checkAp($_POST['corresmail']);
$correstel = $_POST['correstel'];
$corresnom = checkAp($_POST['corresnom']);
$corresfct = checkAp($_POST['corresfct']);
$respo = json_decode(stripslashes($_POST['respo']), true);
$user = checkAp($_POST['user']);
$pass = checkAp($_POST['pass']);

/*On cherche l'id pour le prochain element*/
$ask = mysqli_query($db, "SELECT count(*) from club;");
if(!$ask) {echo mysqli_error($db);}
else{
	$row = mysqli_fetch_assoc($ask) ;
	$id = $row['count(*)'] + 1;

	$ask = mysqli_query($db, "SELECT count(*) from correspondant;");
	if(!$ask) {echo mysqli_error($db);}
	else{
		$row = mysqli_fetch_assoc($ask) ;
		$id2 = $row['count(*)'] + 1;

		$ask = mysqli_query($db, "SELECT count(*) from responsableclub;");
		if(!$ask) {echo mysqli_error($db);}
		else{
			$row = mysqli_fetch_assoc($ask) ;
			$id3 = $row['count(*)'] + 1;

			/*Si pas d'erreur on enregistre le nouveau element*/
			$query = mysqli_query($db, "INSERT INTO club VALUES ('$id', '$id2', '$conf', '$pays', '$ligue', '$fifa',  '$club', '$user', '$pass' );");
			if(!$query) {echo mysqli_error($db);}
			else{

				$query = mysqli_query($db, "INSERT INTO correspondant VALUES ('$id2', '$id', '$corresnom', '$corresfct','$corresmail', '$correstel', 'Club');");
				if(!$query) {echo mysqli_error($db);}
				else{
                    $t = 0;
					for($k=0; $k<count($respo); $k++) {
						$query = mysqli_query($db, "INSERT INTO responsableclub VALUES ('$id3', '$id', '".$respo[$k]['nom']."','".$respo[$k]['qualite']."','".$respo[$k]['mail']."','".$respo[$k]['tel']."');");
						if(!$query) {echo mysqli_error($db);}
                        else{
                            $t++;
                        }
					}
                    if($t == 3) {
                        echo 'Registered';
                    }
				}
			}
		}
	}
}
mysqli_close($db);
?>