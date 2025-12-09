<?php
session_start();

// CORS & Credential Support
header("Access-Control-Allow-Origin: http://localhost:5173"); // Change to your frontend URL
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

// Destroy session completely
$_SESSION = [];                 // Clear session array
session_unset();                // Unset all variables
session_destroy();              // Destroy session
setcookie(session_name(), "", time() - 3600, "/"); // Remove session cookie

echo json_encode([
    "status" => true,
    "message" => "Logged out successfully"
]);
exit;
