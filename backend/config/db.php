<?php
ini_set("display_errors", 0);
ini_set("log_errors", 1);
ini_set("error_log", __DIR__ . "/php-error.log");

$host = "localhost";
$user = "root";     // default WAMP username
$pass = "";         // default WAMP has empty password
$dbname = "self_certification"; // create this DB

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection Failed: " . $conn->connect_error);
}
?>
