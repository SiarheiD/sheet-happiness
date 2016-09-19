<?php
	include("../app/connect_db.php");
	$id = $_POST['id'];
	$place = $_POST['place'];
	$index = $_POST['index'];
if ($id == '*') {
	$query = "DELETE FROM `sh_db`.`".$_SESSION['user_name']."_list` WHERE `place`='recycle';";
	$delete_all = $mysqli->query($query);
}else{
	$query = "SELECT * FROM `sh_db`.`".$_SESSION['user_name']."_list` WHERE `place`='".$place."' AND `index`>=".$index.";";
	$select_index = $mysqli->query($query);

	foreach ($select_index as $key => $value) {
		$query = "UPDATE `sh_db`.`".$_SESSION['user_name']."_list` SET `index`=".($value['index'] - 1)." WHERE `id`=".$value['id'].";";
		$mysqli->query($query);
	}

	$query = "DELETE FROM `sh_db`.`".$_SESSION['user_name']."_list` WHERE `id`=".$id.";";
	$delete = $mysqli->query($query);
}