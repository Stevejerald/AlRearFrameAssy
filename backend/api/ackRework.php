<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") exit;

date_default_timezone_set("Asia/Kolkata");

include "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);

$master_id = $input["master_id"] ?? null;
$emp_id = $input["emp_id"] ?? "REWORK_TEAM"; // Optional: set if login system added

if (!$master_id) {
    echo json_encode(["status" => false, "message" => "master_id required"]);
    exit;
}

/*********************************************************
 * 1. Ensure drop_log entry exists for this master_id
 *********************************************************/
$sql = "SELECT id, rework_progress FROM drop_log WHERE master_id = ? ORDER BY id DESC LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $master_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["status" => false, "message" => "No drop log found for this assembly"]);
    exit;
}

$row = $res->fetch_assoc();
$drop_id = $row["id"];
$progress = $row["rework_progress"];

// Already acknowledged?
if ($progress !== "NOT_ACK") {
    echo json_encode(["status" => false, "message" => "Already acknowledged"]);
    exit;
}

/*********************************************************
 * 2. Update rework_progress → PROCESSING
 *********************************************************/
$ack_time = date("Y-m-d H:i:s");

$update = "
    UPDATE drop_log 
    SET rework_progress = 'PROCESSING',
        acknowledged_by = ?,
        acknowledged_at = ?
    WHERE id = ?
";

$stmt2 = $conn->prepare($update);
$stmt2->bind_param("ssi", $emp_id, $ack_time, $drop_id);

if ($stmt2->execute()) {
    echo json_encode([
        "status" => true,
        "message" => "Rework acknowledged successfully",
        "acknowledged_at" => $ack_time
    ]);
} else {
    echo json_encode(["status" => false, "message" => "Acknowledge update failed"]);
}

$stmt2->close();
$conn->close();
?>
