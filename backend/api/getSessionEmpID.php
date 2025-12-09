<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION["logged_in"])) {
    echo json_encode(["status" => false, "message" => "Not logged in"]);
    exit;
}

echo json_encode([
    "status" => true,
    "emp_id" => $_SESSION["emp_id"]
]);
