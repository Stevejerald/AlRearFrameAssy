<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

date_default_timezone_set("Asia/Kolkata");  // 🔥 INDIA TIMEZONE

include "../config/db.php";

/****************************************
 * READ INPUT
 ****************************************/
$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    echo json_encode(["status" => false, "message" => "Invalid JSON input"]);
    exit;
}

$masterData = $input["master"] ?? null;
$stageData  = $input["stage"] ?? null;

if (!$masterData || !$stageData) {
    echo json_encode(["status" => false, "message" => "Missing master or stage data"]);
    exit;
}

if (!isset($masterData["stage_id"])) {
    echo json_encode(["status" => false, "message" => "stage_id missing in master"]);
    exit;
}

$stage_id = $masterData["stage_id"];

/****************************************
 * VALIDATE STAGE
 ****************************************/
if ($stage_id !== "1L") {
    echo json_encode(["status" => false, "message" => "Only stage 1L is allowed for this API"]);
    exit;
}

/****************************************
 * GENERATE PROD DATE + SHIFT
 ****************************************/
$prod_date = date("Y-m-d");
$hour = intval(date("H"));

if ($hour >= 6 && $hour < 14) {
    $prod_shift = "A";
} elseif ($hour >= 14 && $hour < 22) {
    $prod_shift = "B";
} else {
    $prod_shift = "C";
}

/****************************************
 * INSERT INTO rearframeassymaster
 ****************************************/
$sql = "INSERT INTO RearFrameAssyMaster
        (stage_id, prod_date, prod_shift,
         axle_serial_no, axle_spec, axle_casing_part_no,
         brake_part_no_lh, brake_part_no_rh, cwp_diff_carrier_no,
         axle_qr, brake_qr, hub_qr, abs_qr)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => false, "message" => "Database prepare error: ".$conn->error]);
    exit;
}

$stmt->bind_param(
    "sssssssssssss",
    $stage_id,
    $prod_date,
    $prod_shift,
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
    echo json_encode(["status" => false, "message" => "Master insert failed: ".$stmt->error]);
    exit;
}

$master_id = $stmt->insert_id;
$stmt->close();

/****************************************
 * INSERT STAGE TASKS
 ****************************************/
$sql2 = "INSERT INTO RearFrameAssyStageTasks
        (master_id, stage_id, task_no, description, status, audio)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt2 = $conn->prepare($sql2);

if (!$stmt2) {
    echo json_encode(["status" => false, "message" => "Prepare task insert failed: ".$conn->error]);
    exit;
}

/****************************************
 * PREPARE not_ok_log INSERT
 ****************************************/
$sql_not_ok = "INSERT INTO not_ok_log
    (master_id, stage_id, task_no, description, status)
    VALUES (?, ?, ?, ?, ?)";

$stmt_not_ok = $conn->prepare($sql_not_ok);

if (!$stmt_not_ok) {
    echo json_encode([
        "status" => false,
        "message" => "Prepare not_ok_log failed: " . $conn->error
    ]);
    exit;
}

foreach ($stageData as $t) {

    $task_no     = intval($t["task_no"]);
    $description = $t["description"];
    $status      = $t["status"];
    $audio       = $t["audio"] ?? null;

    // Insert into RearFrameAssyStageTasks
    $stmt2->bind_param(
        "isisss",
        $master_id,
        $stage_id,
        $task_no,
        $description,
        $status,
        $audio
    );

    if (!$stmt2->execute()) {
        echo json_encode(["status" => false, "message" => "Task insert failed: ".$stmt2->error]);
        exit;
    }

    // If NOT OK → log into not_ok_log
    if (strtolower($status) === "no") {
        $stmt_not_ok->bind_param(
            "isiss",
            $master_id,
            $stage_id,
            $task_no,
            $description,
            $status
        );
        if (!$stmt_not_ok->execute()) {
            echo json_encode([
                "status" => false,
                "message" => "not_ok_log insert failed: " . $stmt_not_ok->error
            ]);
            exit;
        }
    }
}

$stmt2->close();
$stmt_not_ok->close();

/****************************************
 * BUILD CONVEYOR SEQUENCE FOR STAGES 1–13
 ****************************************/
$sqlSeq = "INSERT INTO ConveyorSequence (master_id, stage_id, processed)
           VALUES (?, ?, ?)";

$stmtSeq = $conn->prepare($sqlSeq);

if (!$stmtSeq) {
    echo json_encode(["status" => false, "message" => "Prepare sequence failed: ".$conn->error]);
    exit;
}

for ($i = 1; $i <= 13; $i++) {
    foreach (["L", "R", "INSP"] as $side) {

        $fullStage   = $i . $side;
        $isProcessed = ($fullStage === "1L") ? 1 : 0;

        $stmtSeq->bind_param("isi", $master_id, $fullStage, $isProcessed);

        if (!$stmtSeq->execute()) {
            echo json_encode(["status" => false, "message" => "Sequence insert failed: ".$stmtSeq->error]);
            exit;
        }
    }
}

$stmtSeq->close();
$conn->close();

/****************************************
 * SUCCESS RESPONSE
 ****************************************/
echo json_encode([
    "status"      => true,
    "message"     => "Stage 1L submitted successfully. Conveyor sequence created.",
    "master_id"   => $master_id,
    "prod_date"   => $prod_date,
    "prod_shift"  => $prod_shift
]);
?>
