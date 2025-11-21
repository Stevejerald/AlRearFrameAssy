<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

include "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["status" => false, "message" => "Invalid JSON"]);
    exit;
}

$stage_id    = $input["stage_id"]    ?? null;  // e.g. '1R'
$sequence_id = $input["sequence_id"] ?? null;  // ConveyorSequence.id
$master_id   = $input["master_id"]   ?? null;  // RearFrameAssyMaster.id
$stageData   = $input["stage"]       ?? null;

if (!$stage_id || !$sequence_id || !$master_id || !$stageData) {
    echo json_encode(["status" => false, "message" => "Missing parameters"]);
    exit;
}

// INSERT STAGE TASKS
$sql = "INSERT INTO RearFrameAssyStageTasks
        (master_id, stage_id, task_no, description, status, audio)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

foreach ($stageData as $t) {
    $task_no = $t["task_no"];
    $description = $t["description"];
    $status = $t["status"];
    $audio = $t["audio"] ?? null;

    $stmt->bind_param(
        "isisss",
        $master_id,
        $stage_id,
        $task_no,
        $description,
        $status,
        $audio
    );

    if (!$stmt->execute()) {
        echo json_encode(["status" => false, "message" => "Insert failed: " . $stmt->error]);
        exit;
    }
}

$stmt->close();

// MARK SEQUENCE AS PROCESSED
$sql2 = "UPDATE ConveyorSequence 
         SET processed = 1 
         WHERE id = ?";

$stmt2 = $conn->prepare($sql2);

if (!$stmt2) {
    echo json_encode(["status" => false, "message" => "Sequence update failed: " . $conn->error]);
    exit;
}

$stmt2->bind_param("i", $sequence_id);

if (!$stmt2->execute()) {
    echo json_encode(["status" => false, "message" => "Sequence update failed: " . $stmt2->error]);
    exit;
}

$stmt2->close();
$conn->close();

echo json_encode(["status" => true, "message" => "Stage submitted successfully"]);
?>
