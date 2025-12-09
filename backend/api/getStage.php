<?php
session_start(); // start session

header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

include "../config/db.php";

$empId = $_GET['emp_id'] ?? '';

if ($empId == '') {
    echo json_encode(["status" => false, "message" => "Employee ID required"]);
    exit;
}

$sql = "SELECT stage FROM device_master WHERE emp_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $empId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(["status" => false, "message" => "No device config found"]);
    exit;
}

$row = $result->fetch_assoc();

// store session values
$_SESSION["logged_in"] = true;
$_SESSION["emp_id"]    = $empId;
$_SESSION["stage"]     = $row['stage'];

echo json_encode([
    "status" => true,
    "stage"  => $row['stage'],
    "emp_id" => $empId
]);
