<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

include "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);

$sequence_id = $input["sequence_id"] ?? null;

if (!$sequence_id) {
    echo json_encode(["status" => false, "message" => "Missing sequence_id"]);
    exit;
}

$sql = "UPDATE ConveyorSequence SET dropped = 1, processed = 1 WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $sequence_id);

if ($stmt->execute()) {
    echo json_encode(["status" => true, "message" => "Assembly dropped"]);
} else {
    echo json_encode(["status" => false, "message" => "Drop failed"]);
}

$stmt->close();
$conn->close();
?>
