<?php
session_start();

$mysqli = new mysqli("localhost", "root", "", "sh_db");

if ($mysqli->connect_errno) {
    echo "Не удалось подключиться: ". $mysqli->connect_error;
    die;
}
?>