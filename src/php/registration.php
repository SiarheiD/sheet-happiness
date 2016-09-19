<?php
	if($_POST['login'] && $_POST['password']){
		include("connect_db.php");
		$login = $_POST['login'];
		$password = sha1(trim($_POST['password']));
		$query = "SELECT * FROM `sh_db`.`users` WHERE `login`='" .$login. "'";
		$result = $mysqli->query($query);
		if ( $result->num_rows == 0){
			$insert = $mysqli->query("INSERT INTO `sh_db`.`users` (`login`,`password`) VALUES ('".$login."', '".$password."')");
			if($mysqli->insert_id) {
				$_SESSION['user_name'] = $_POST['login'];
				if($_POST['remember_me']){
					$user_data = json_encode(array('login' => $_POST['login'], 'password' => sha1(trim($_POST['password']))));
					setcookie("user", $user_data, time()+3600*24*365); 
				}
				$create_user_table_query = 
				'CREATE TABLE `'.$_POST['login'].'_list` (
					`id` INT NOT NULL AUTO_INCREMENT,
					`title` CHAR(255) NOT NULL,
					`content` TEXT NOT NULL,
					`deadline` CHAR(12) NOT NULL,
					`importance` TINYINT NOT NULL DEFAULT \'0\',
					`place` CHAR(50) NOT NULL,
					`index` TINYINT NOT NULL,
					PRIMARY KEY (`id`)
				);';
				$create =  $mysqli->query($create_user_table_query);

				$query = "SELECT `id`, `title`, `content`, `deadline`, `importance`, `place`, `index` FROM `sh_db`.`administrator_list`";
				$result = $mysqli->query($query);
				foreach ($result as $key => $value) {
					$query = "INSERT INTO `sh_db`.`".$_SESSION['user_name']."_list` (`title`, `content`, `deadline`, `importance`, `place`, `index`) VALUES ('".$value['title']."', '".$value['content']."', '".$value['deadline']."', '".$value['importance']."', '".$value['place']."', '".$value['index']."');";
					$create_def = $mysqli->query($query);
				}
			}
		}
	}
header("Location:/index.php?ref=reg");