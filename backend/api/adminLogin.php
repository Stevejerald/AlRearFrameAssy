<?php
session_start();

// Allow frontend React app to send/receive session cookies
header("Access-Control-Allow-Origin: http://localhost:5173"); // change if React uses another port
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Preflight request handling
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

include "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);

$email = $input["email"] ?? "";
$password = $input["password"] ?? "";

if (empty($email) || empty($password)) {
    echo json_encode([
        "status" => false,
        "message" => "Email and password are required"
    ]);
    exit;
}

// Fetch user from DB
$sql = "SELECT emp_id, name, email, password, role FROM admin_details WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "status" => false,
        "message" => "Invalid email or password"
    ]);
    exit;
}

$user = $result->fetch_assoc();

// Verify password hash
if (!password_verify($password, $user["password"])) {
    echo json_encode([
        "status" => false,
        "message" => "Incorrect password"
    ]);
    exit;
}

// ---- SET SESSION ----
$_SESSION["logged_in"] = true;
$_SESSION["emp_id"] = $user["emp_id"];
$_SESSION["name"] = $user["name"];
$_SESSION["email"] = $user["email"];
$_SESSION["role"] = $user["role"];

// ---- SEND RESPONSE ----
echo json_encode([
    "status" => true,
    "message" => "Login successful",
    "user" => [
        "emp_id" => $user["emp_id"],
        "name" => $user["name"],
        "email" => $user["email"],
        "role" => $user["role"]
    ]
]);

exit;
?>
