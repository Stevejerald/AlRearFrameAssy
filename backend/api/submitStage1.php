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

// Extract master data
$masterData = $input["master"] ?? null;
$stageData  = $input["stage"]  ?? null;

if (!$masterData || !$stageData) {
    echo json_encode(["status" => false, "message" => "Missing required data"]);
    exit;
}

// Insert into RearFrameAssyMaster
$sql = "INSERT INTO RearFrameAssyMaster
        (stage_id, date_shift, axle_serial_no, axle_spec, axle_casing_part_no,
         brake_part_no_lh, brake_part_no_rh, cwp_diff_carrier_no,
         axle_qr, brake_qr, hub_qr, abs_qr)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "isssssssssss",
    $masterData["stage_id"],
    $masterData["dateShift"],
    $masterData["axleSerialNo"],
    $masterData["axleSpec"],
    $masterData["axleCasingPartNo"],
    $masterData["brakePartNoLH"],
    $masterData["brakePartNoRH"],
    $masterData["cwpDiffNo"],
    $masterData["axleQR"],
    $masterData["brakeQR"],
    $masterData["hubQR"],
    $masterData["absQR"]
);

if (!$stmt->execute()) {
    echo json_encode(["status" => false, "message" => "Master insert failed"]);
    exit;
}

$master_id = $stmt->insert_id;
$stmt->close();

// Insert stage tasks
foreach ($stageData as $task) {
    $sql2 = "INSERT INTO RearFrameAssyStage1 
            (master_id, task_no, description, status, audio)
             VALUES (?, ?, ?, ?, ?)";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param(
        "iisss",
        $master_id,
        $task["task_no"],
        $task["description"],
        $task["status"],
        $task["audio"]
    );
    $stmt2->execute();
    $stmt2->close();
}

echo json_encode(["status" => true, "message" => "Stage saved successfully"]);
$conn->close();
