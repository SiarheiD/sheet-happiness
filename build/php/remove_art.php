<?php
	include("connect_db.php");
	$id = $_POST['id'];
	$place = $_POST['place'];
	$index = $_POST['index'];
	$user = $_POST['user'];


	$query = "SELECT * FROM `sh_new_db`.`".$user."_list` WHERE `place`='".$place."' AND `index`>=".$index.";";
	$select_index = $mysqli->query($query);

	foreach ($select_index as $key => $value) {
		$query = "UPDATE `sh_new_db`.`".$user."_list` SET `index`=".($value['index'] - 1)." WHERE `id`=".$value['id'].";";
		$mysqli->query($query);
	}

	$query = "DELETE FROM `sh_new_db`.`".$user."_list` WHERE `id`=".$id.";";
	$delete = $mysqli->query($query);
