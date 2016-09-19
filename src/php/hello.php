<!-- <?php
	$ref = $_GET['ref'];
	$log_checked = "checked";
	$reg_checked = "";
	$log_err_msg = "";
	$reg_err_msg = "";
	if ($ref == "login"){
		$log_checked = "checked";
		$log_err_msg = "Check your login and password";
	}else
	if ($ref == "reg"){
		$reg_checked = "checked";
		$reg_err_msg = "Choose another login...";
	}
?> -->
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Hello!</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css">
	<link rel="stylesheet" href="../css/hello.css">
</head>
<body>
	<div class="reg-log">
		<input id="log-radio" type="radio" name="tabs" <?=$log_checked?>>
		<input id="reg-radio" type="radio" name="tabs"<?=$reg_checked?>>

		<label for="log-radio" class="log-tab">Login</label>
		<label for="reg-radio" class="reg-tab">Registration</label>

		<form class="login" action="/app/login.php" method="POST">
			<p>
				<input class="log-inp" type="text" placeholder="Login..." name="login" required>
			</p>
			<p>
				<input class="pass-inp" type="password" placeholder="Password..." name="password" required>
			</p>
			<p class="remember">
				<input class="rem-inp" type="checkbox" name="remember_me" checked>Remember me
			</p>
			<p class="err-msg"><?=$log_err_msg?></p>
		<input class="submit" type="submit" value="Login">
		</form>

		<form class="registration" action="/app/registration.php" method="POST">
			<p>
				<input class="reg-inp" type="text" placeholder="Login..." name="login" required>
			</p>
			<p>
				<input class="pass-inp" type="password" placeholder="Password..." name="password" required>
			</p>
			<p class="remember">
				<input class="rem-inp" type="checkbox" name="remember_me" checked=>Remember me
			</p>
			<p class="err-msg"><?=$reg_err_msg?></p>
		<input class="submit" type="submit" value="Register">
		</form>
	</div>
</body>
</html>