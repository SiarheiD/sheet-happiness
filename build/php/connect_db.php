<?php
session_start();

$mysqli = new mysqli("localhost", "root", "", "sh_new_db");

if ($mysqli->connect_errno) {
    echo "Не удалось подключиться: ". $mysqli->connect_error;
    die;
}
?>