<?php
session_start();

// CORS & Credential Support
header("Access-Control-Allow-Origin: http://localhost:5173"); // change to your React URL & port
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

if (!isset($_SESSION["logged_in"]) || $_SESSION["logged_in"] !== true) {
    echo json_encode([
        "status" => false,
        "message" => "Not logged in"
    ]);
    exit;
}

echo json_encode([
    "status" => true,
    "user" => [
        "emp_id" => $_SESSION["emp_id"],
        "name"  => $_SESSION["name"],
        "email" => $_SESSION["email"],
        "role"  => $_SESSION["role"]
    ]
]);

exit;
?>
