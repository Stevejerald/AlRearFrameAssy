<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include "../config/db.php";

$emp_id = $_GET["EMPID"] ?? null;

if (!$emp_id) {
    echo json_encode([
        "status" => false,
        "message" => "EMPID is required"
    ]);
    exit;
}

// Check table exists
$check = $conn->query("SHOW TABLES LIKE 'device_master'");
if ($check->num_rows === 0) {
    echo json_encode([
        "status" => false,
        "message" => "device_master table is missing"
    ]);
    exit;
}

// Fetch employee
$sql = "SELECT emp_id, stage FROM device_master WHERE emp_id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => "SQL prepare failed: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("s", $emp_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode([
        "status" => false,
        "message" => "Invalid EMPID or Employee not registered"
    ]);
    exit;
}

$user = $res->fetch_assoc();
$stage = $user["stage"];

// If stage missing
if (!$stage) {
    echo json_encode([
        "status" => false,
        "message" => "No stage assigned for this EMPID"
    ]);
    exit;
}

// SUCCESS → REDIRECT TO STAGE PAGE
header("Location: http://localhost:5173/stage/$stage");
exit;

?>
