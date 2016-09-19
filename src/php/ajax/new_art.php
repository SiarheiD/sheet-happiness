<?php
	include("../app/connect_db.php");
	$title = $_POST['title'];
	$content = $_POST['content'];
	$deadline = $_POST['deadline'];
	$importance = $_POST['importance'];
	$place = $_POST['place'];
	$index = $_POST['index'];
	$old_id= $_POST['new'];
if (!$old_id) {
	$query = "SELECT * FROM `sh_db`.`".$_SESSION['user_name']."_list` WHERE `place`='".$place."' AND `index`>=".$index.";";
	$select_index = $mysqli->query($query);

	foreach ($select_index as $key => $value) {
		$query = "UPDATE `sh_db`.`".$_SESSION['user_name']."_list` SET `index`=".($value['index'] + 1)." WHERE `id`=".$value['id'].";";
		$mysqli->query($query);
	}

	$query = "INSERT INTO `sh_db`.`".$_SESSION['user_name']."_list` (`title`, `content`, `deadline`, `importance`, `place`, `index`) VALUES ('".$title."', '".$content."', '".$deadline."', '".$importance."', '".$place."', '".$index."');";
	$insert = $mysqli->query($query);
echo $mysqli->insert_id;
}else{
		$query = "UPDATE `sh_db`.`".$_SESSION['user_name']."_list` SET `title`='".$title."', `content`='".$content."', `deadline`='".$deadline."', `importance`='".$importance."', `place`='".$place."', `index`='".$index."' WHERE `id`=".$old_id.";";
		$mysqli->query($query);
}