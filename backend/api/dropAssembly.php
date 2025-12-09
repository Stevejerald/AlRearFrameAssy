<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

date_default_timezone_set("Asia/Kolkata");

include "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);

$sequence_id = $input["sequence_id"] ?? null;
$emp_id      = $input["emp_id"] ?? null;    // 🔥 Capture employee ID if available
$reason      = $input["reason"] ?? null;    // 🔥 Optional drop reason

if (!$sequence_id) {
    echo json_encode(["status" => false, "message" => "Missing sequence_id"]);
    exit;
}

/**************************************
 * 1. MARK THIS STAGE AS DROPPED
 **************************************/
$sql = "UPDATE ConveyorSequence 
        SET dropped = 1, processed = 1 
        WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $sequence_id);

if (!$stmt->execute()) {
    echo json_encode(["status" => false, "message" => "Drop failed"]);
    exit;
}

$stmt->close();

/**************************************
 * 2. FIND MASTER ID + STAGE ID
 **************************************/
$sql2 = "SELECT master_id, stage_id 
         FROM ConveyorSequence 
         WHERE id = ?";

$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("i", $sequence_id);
$stmt2->execute();
$result = $stmt2->get_result();

if (!$row = $result->fetch_assoc()) {
    echo json_encode(["status" => false, "message" => "Invalid sequence_id"]);
    exit;
}

$master_id = $row["master_id"];
$stage_id  = $row["stage_id"];

$stmt2->close();

/**************************************
 * 3. GET master prod_date and shift
 **************************************/
$sql3 = "SELECT prod_date, prod_shift FROM rearframeassymaster WHERE id = ?";
$stmt3 = $conn->prepare($sql3);
$stmt3->bind_param("i", $master_id);
$stmt3->execute();
$res3 = $stmt3->get_result();
$m = $res3->fetch_assoc();
$stmt3->close();

/**************************************
 * 4. INSERT DROP LOG ENTRY
 **************************************/
$sql4 = "INSERT INTO drop_log 
        (master_id, sequence_id, stage_id, emp_id, prod_date, prod_shift, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt4 = $conn->prepare($sql4);
$stmt4->bind_param(
    "iisssss",
    $master_id,
    $sequence_id,
    $stage_id,
    $emp_id,
    $m["prod_date"],
    $m["prod_shift"],
    $reason
);

$stmt4->execute();
$stmt4->close();

/**************************************
 * 5. MARK MASTER FOR REWORK
 **************************************/
$sql5 = "UPDATE rearframeassymaster 
         SET rework_status = 'PENDING'
         WHERE id = ?";

$stmt5 = $conn->prepare($sql5);
$stmt5->bind_param("i", $master_id);
$stmt5->execute();
$stmt5->close();

$conn->close();

/**************************************
 * 6. FINAL RESPONSE
 **************************************/
echo json_encode([
    "status" => true,
    "message" => "Assembly dropped & logged & sent to REWORK",
    "master_id" => $master_id,
    "stage_id" => $stage_id
]);
?>
