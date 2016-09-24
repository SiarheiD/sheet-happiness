<?php

	if($_POST['login'] && $_POST['password'] && $_POST['action']){

		include("connect_db.php");

		$login = $_POST['login'];
		$password = sha1(trim($_POST['password']));
		$action = $_POST['action'];

		if ($action == "signin"){
			$query = "SELECT * FROM `sh_new_db`.`users` WHERE `login`='" .$login. "'";
			$result = $mysqli->query($query);
			if ( $result->num_rows == 0){
				$insert = $mysqli->query("INSERT INTO `sh_new_db`.`users` (`login`,`password`) VALUES ('".$login."', '".$password."')");

				$create_user_table_query = 
				'CREATE TABLE `'.$_POST['login'].'_list` (
					`id` INT NOT NULL AUTO_INCREMENT,
					`content` TEXT NOT NULL,
					`place` CHAR(50) NOT NULL,
					`index` TINYINT NOT NULL,
					PRIMARY KEY (`id`)
				);';

				$create =  $mysqli->query($create_user_table_query);

				$query = "SELECT `id`, `content`, `place`, `index` FROM `sh_new_db`.`admin_list`";

				$result = $mysqli->query($query);
				foreach ($result as $key => $value) {
					$query = "INSERT INTO `sh_new_db`.`".$login."_list` (`content`,  `place`, `index`) VALUES ('".$value['content']."', '".$value['place']."', '".$value['index']."');";
					$create_def = $mysqli->query($query);
				}

				$data = array();
				$query = "SELECT * FROM `sh_new_db`.`".$login."_list";
				$datadb = $mysqli->query($query);

				while($row = $datadb->fetch_assoc()){
					$data[] = $row;
				}

				echo json_encode($data);

			} else {
				echo 'failure';
			}
		}

		if ($action == "login"){

			$user = $mysqli->query("SELECT login FROM users WHERE login='" . $login . "' AND password='" . $password . "'");
			$user = $user->fetch_assoc()['login'];

			if($user){
				$data = array();
				$query = "SELECT * FROM `sh_new_db`.`".$login."_list` ORDER BY `index`";
				$datadb = $mysqli->query($query);

				while($row = $datadb->fetch_assoc()){
					$data[] = $row;
				}

				echo json_encode($data);

			} else {
				echo 'failure';
			}

		}

	}






