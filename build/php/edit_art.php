<?php
	include("connect_db.php");
	$id = $_POST['id'];
	$content = $_POST['content'];
	$user = $_POST['user'];

		$query = "UPDATE `sh_new_db`.`".$user."_list` SET  `content`='".$content."' WHERE `id`=".$id.";";
		$mysqli->query($query);