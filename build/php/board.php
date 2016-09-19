<?php
	include("connect_db.php");
	$user_name = $_SESSION['user_name'];
	// select articles where User_name is $user_name
	$list_table_name = $user_name.'_list';
	$back_log_list = $mysqli->query(get_query('back-log'));
	$column_1_list = $mysqli->query(get_query('column-1'));
	$column_2_list = $mysqli->query(get_query('column-2'));
	$column_3_list = $mysqli->query(get_query('column-3'));
	$column_4_list = $mysqli->query(get_query('column-4'));
	$column_5_list = $mysqli->query(get_query('column-5'));
	$column_6_list = $mysqli->query(get_query('column-6'));
	$column_7_list = $mysqli->query(get_query('column-7'));
	$done_list = $mysqli->query(get_query('done'));
	$recycle_list = $mysqli->query(get_query('recycle'));
	function get_query($place){
		global $list_table_name;
		return "SELECT * FROM `sh_db`.`".$list_table_name."` WHERE `place` = '" . $place . "' ORDER BY `index`";
	}
	function get_content($col){
		$article = '';
		foreach ($col as $key => $value) {
			switch ($value['importance']) {
				case 0:
					$imp = '_green';
					break;
				case 1:
					$imp = '_yellow';
					break;
				case 2:
					$imp = '_red';
					break;
				}
?>
			<article class="iteration__column__sheet" data-id="<?=$value['id']?>" data-index="<?=$value['index']?>">
			<div class="menu">
				<ul>
					<li class="edit"><i class="fa fa-pencil"></i></li>
					<li class="description"><i class="fa fa-eye"></i></li>
					<li class="to-done"><i class="fa fa-check"></i></li>
					<li class="delete"><i class="fa fa-close"></i></li>
				</ul>
			</div>
			<h1 class="title"><?=$value['title']?></h1>
			<p class="content"><?=$value['content']?></p>
			<p class="deadline"><?=$value['deadline']?></p>
					<div class="ribbon-wrapper">
						<div class="ribbon-wrapper">
							<div class="corner-ribbon <?=$imp?>"></div>
						</div>
					</div>
		</article>
<?php
		}
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Sheet happiness</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css">
	<link rel="stylesheet" href="../css/main.css">
</head>
<body>
<section class="board">
	<header>
		<div class="profile">
			<span class="user-name"><?=$user_name?></span>
			<a href="/app/logout.php" class="logout"><i class="fa fa-sign-out"></i></a>
		</div>
	</header>
	<main>
		<div class="back-log">
			<div class="side-button">
				<span></span>
			</div>
			<div class="back-log__field _article-box" data-place="back-log">

			<?php
				get_content($back_log_list);
			?>

			</div>
		</div>
		<div class="iteration">
			<div class="iteration__column _article-box" data-place="column-1">

			<?php
				get_content($column_1_list);
			?>


			</div>
			<div class="iteration__column _article-box" data-place="column-2">

			<?php
				get_content($column_2_list);
			?>


			</div>
			<div class="iteration__column _article-box" data-place="column-3">

			<?php
				get_content($column_3_list);
			?>


			</div>
			<div class="iteration__column _article-box" data-place="column-4">

			<?php
				get_content($column_4_list);
			?>


			</div>
			<div class="iteration__column _article-box" data-place="column-5">

			<?php
				get_content($column_5_list);
			?>


			</div>
			<div class="iteration__column _article-box" data-place="column-6">

			<?php
				get_content($column_6_list);
			?>


			</div>
			<div class="iteration__column _article-box" data-place="column-7">

			<?php
				get_content($column_7_list);
			?>


			</div>
		</div>
		<div class="done">
			<div class="side-button">
				<span></span>
			</div>
			<div class="done__field _article-box" data-place="done">

			<?php
				get_content($done_list);
			?>

			</div>
		</div>
		<div class="recycle">
			<div class="recycle-field _article-box" data-place="recycle">
				<ul class="recycle-field__panel">
					<li class="roll-back"><i class="fa fa-reply"></i></li>
					<li class="clear"><i class="fa fa-fire"></i></li>
					<li class="close"><i class="fa fa-close"></i></li>
				</ul>

			<?php
				get_content($recycle_list);
			?>

			</div>
		</div>
		<div class="main-panel">
			<div class="main-panel__create"><i class="fa fa-plus"></i></div>
			<div class="main-panel__recycle"><i class="fa fa-recycle"></i></div>
		</div>
	</main>
</section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js"></script>
<script src='../js/main.js'></script>
</body>
</html>