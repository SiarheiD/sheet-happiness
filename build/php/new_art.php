<?php
	include("connect_db.php");
	$id = $_POST['id'];
	$content = $_POST['content'];
	$place = $_POST['place'];
	$index = $_POST['index'];
	$user = $_POST['user'];

	$query = "INSERT INTO `sh_new_db`.`".$user."_list` (`id`, `content`, `place`, `index`) VALUES ('".$id."', '".$content."', '".$place."', '".$index."');";
		$mysqli->query($query);