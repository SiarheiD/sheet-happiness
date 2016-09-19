<?php
	if($_POST['login'] && $_POST['password']){
		include("connect_db.php");

		$user = $mysqli->query("SELECT login FROM users WHERE login='" . $_POST['login'] . "' AND password='" .  sha1(trim($_POST['password'])) . "'");
		$user = $user->fetch_assoc()['login'];
		if($user) {
			$_SESSION['user_name'] = $user;
			if($_POST['remember_me']){
				$user_data = json_encode(array('login' => $_POST['login'], 'password' => sha1(trim($_POST['password']))));
				setcookie("user", $user_data, time()+3600*24*365); 
			}
		}else{
			header("Location:/index.php?ref=login");
		}
}
header("Location:/index.php?ref=login");

