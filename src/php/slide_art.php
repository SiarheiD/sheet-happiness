<?php
	include("connect_db.php");
	$id = $_POST['id'];
	$old_place = $_POST['old_place'];
	$old_index = $_POST['old_index'];
	$new_place = $_POST['new_place'];
	$new_index = $_POST['new_index'];
	$user = $_POST['user'];

if (!($old_place == $new_place)){
	$query = "SELECT * FROM `sh_new_db`.`".$user."_list` WHERE `place`='".$new_place."' AND `index`>=".$new_index.";";
	$select_index = $mysqli->query($query);

	foreach ($select_index as $key => $value) {
		$query = "UPDATE `sh_new_db`.`".$user."_list` SET `index`=".($value['index'] + 1)." WHERE `id`=".$value['id'].";";
		$mysqli->query($query);
	}

//move

	$query = "UPDATE `sh_new_db`.`".$user."_list` SET `place`='".$new_place."', `index`=".$new_index." WHERE `id`=".$id.";";
	$update = $mysqli->query($query);

//update index inside the old place
	$query = "SELECT * FROM `sh_new_db`.`".$user."_list` WHERE `place`='".$old_place."' AND `index`>".$old_index.";";
	$select_index = $mysqli->query($query);

	foreach ($select_index as $key => $value) {
		$query = "UPDATE `sh_new_db`.`".$user."_list` SET `index`=".($value['index'] - 1)." WHERE `id`=".$value['id'].";";
		$mysqli->query($query);
	}
}else{
	if ($new_index > $old_index){
		$query = "SELECT * FROM `sh_new_db`.`".$user."_list` WHERE `place`='".$new_place."' AND `index`>".$old_index." AND `index` <=".$new_index.";";
		$select_index = $mysqli->query($query);
		foreach ($select_index as $key => $value) {
			$query = "UPDATE `sh_new_db`.`".$user."_list` SET `index`=".($value['index'] - 1)." WHERE `id`=".$value['id'].";";
			$mysqli->query($query);
		}
	}else
	if ($new_index < $old_index){
		$query = "SELECT * FROM `sh_new_db`.`".$user."_list` WHERE `place`='".$new_place."' AND `index`<".$old_index." AND `index` >=".$new_index.";";
		$select_index = $mysqli->query($query);
		foreach ($select_index as $key => $value) {
			$query = "UPDATE `sh_new_db`.`".$user."_list` SET `index`=".($value['index'] + 1)." WHERE `id`=".$value['id'].";";
			$mysqli->query($query);
		}
	}
	$query = "UPDATE `sh_new_db`.`".$user."_list` SET `place`='".$new_place."', `index`=".$new_index." WHERE `id`=".$id.";";
	$update = $mysqli->query($query);
}
	echo $update;
