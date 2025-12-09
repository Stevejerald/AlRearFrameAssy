<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") exit;

date_default_timezone_set("Asia/Kolkata");
include "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);

$id = $input["id"] ?? null;

/************************************
 * VALIDATION
 ************************************/
if (!$id) {
    echo json_encode([
        "status" => false,
        "message" => "ID is required."
    ]);
    exit;
}

/************************************
 * DELETE WORKPLAN
 ************************************/
$sql = "DELETE FROM workplan WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode([
        "status" => true,
        "message" => "Workplan deleted successfully."
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Failed to delete workplan."
    ]);
}

$stmt->close();
$conn->close();
?>
