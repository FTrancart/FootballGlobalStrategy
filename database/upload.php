<?php
$db = mysqli_connect('sql310.epizy.com','epiz_24233037','Tjckfd0Xzrp','epiz_24233037_footplatform') or die('Error connecting to MySQL server.');
$query = mysqli_query($db, "SELECT count(*) FROM club;");
if(!$query) {
    echo mysqli_error($db);
}
else{
    $row = mysqli_fetch_assoc($query) ; 
    $id = $row["count(*)"] + 1;
}
$target_file = "htdocs/images/" . basename($_FILES["fileToUpload"]["name"]);
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
$uploadOk = 1;
$check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
if($check !== false) {
    echo "File is an image - " . $check["mime"] . ".";
    $uploadOk = 1;
} else {
    echo "File is not an image.";
    $uploadOk = 0;
}

if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
    $uploadOk = 0;
}
// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" ) {
    echo "Sorry, only JPG, JPEG & PNG files are allowed.";
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
$server = 'ftpupload.net' ;//Address of ftp server
$user_name = 'epiz_24233037'; // Username
$password = 'Tjckfd0Xzrp'; // Password

$source_file = $_FILES["fileToUpload"]["tmp_name"]; 
$dest = 'htdocs/images/';
$connection = ftp_connect($server, 21) or die("Couldn't connect to     $ftp_server"); 
ftp_login($connection, $user_name, $password) or die("Cannot login");
ftp_put($connection, $dest."logoclub".$id.".png", $source_file, FTP_BINARY) or die ("Cannot upload");
ftp_close($connection);
mysqli_close($db);
}
?>