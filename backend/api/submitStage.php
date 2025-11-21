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

$masterData = $input["master"] ?? null;
$stageData  = $input["stage"] ?? null;

if (!$masterData || !$stageData) {
    echo json_encode(["status" => false, "message" => "Missing data"]);
    exit;
}

if (!isset($masterData["stage_id"])) {
    echo json_encode(["status" => false, "message" => "stage_id is missing"]);
    exit;
}

$stage_id = $masterData["stage_id"];  // example: '1L'

// Only 1L should reach here
if ($stage_id !== '1L') {
    echo json_encode(["status" => false, "message" => "This API only accepts stage 1L"]);
    exit;
}

/****************************************
 * INSERT MASTER
 ****************************************/
$sql = "INSERT INTO RearFrameAssyMaster
        (stage_id, date_shift, axle_serial_no, axle_spec, axle_casing_part_no,
         brake_part_no_lh, brake_part_no_rh, cwp_diff_carrier_no,
         axle_qr, brake_qr, hub_qr, abs_qr)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ssssssssssss",
    $stage_id,
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

$stmt->execute();
$master_id = $stmt->insert_id;
$stmt->close();

/****************************************
 * INSERT 1L STAGE TASKS
 ****************************************/
$sql2 = "INSERT INTO RearFrameAssyStageTasks 
        (master_id, stage_id, task_no, description, status, audio)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt2 = $conn->prepare($sql2);

foreach ($stageData as $t) {

    $task_no = intval($t["task_no"]);
    $description = $t["description"];
    $status = $t["status"];
    $audio = $t["audio"] ?? null;

    // Correct bind_param order
    $stmt2->bind_param(
        "isisss",
        $master_id,
        $stage_id,
        $task_no,
        $description,
        $status,
        $audio
    );

    $stmt2->execute();
}

$stmt2->close();

/****************************************
 * INSERT FULL CONVEYOR SEQUENCE (1–13, L/R/INSP)
 ****************************************/

$sqlSeq = "INSERT INTO ConveyorSequence (master_id, stage_id, processed)
           VALUES (?, ?, ?)";

$stmtSeq = $conn->prepare($sqlSeq);

for ($i = 1; $i <= 13; $i++) {
    foreach (["L", "R", "INSP"] as $side) {

        $fullStage = $i . $side;
        $processed = ($fullStage === "1L") ? 1 : 0;

        $stmtSeq->bind_param("isi", $master_id, $fullStage, $processed);
        $stmtSeq->execute();
    }
}

$stmtSeq->close();
$conn->close();

echo json_encode([
    "status" => true,
    "message" => "Stage 1L submitted + full conveyor sequence generated"
]);
?>
