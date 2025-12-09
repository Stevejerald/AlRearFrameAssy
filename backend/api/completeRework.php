<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

date_default_timezone_set("Asia/Kolkata");

include "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);

$master_id = $input["master_id"] ?? null;
$emp_id = $input["emp_id"] ?? "REWORK_TEAM";

if (!$master_id) {
    echo json_encode(["status" => false, "message" => "master_id required"]);
    exit;
}

/***********************************************************
 * 1) CHECK ANY TASK STILL "no"
 ***********************************************************/
$sqlCheck = "
    SELECT COUNT(*) AS pending 
    FROM rearframeassystagetasks 
    WHERE master_id = ? AND status = 'no'
";

$stmtCheck = $conn->prepare($sqlCheck);
$stmtCheck->bind_param("i", $master_id);
$stmtCheck->execute();
$resCheck = $stmtCheck->get_result()->fetch_assoc();
$stmtCheck->close();

if ($resCheck["pending"] > 0) {
    echo json_encode([
        "status" => false,
        "message" => "Rework cannot be completed. Some tasks are still NOT fixed.",
        "pending_tasks" => $resCheck["pending"]
    ]);
    exit;
}

/***********************************************************
 * 2) UPDATE REWORK STATUS IN MASTER TABLE
 ***********************************************************/
$sqlMaster = "
    UPDATE rearframeassymaster 
    SET rework_status = 'CLEAR'
    WHERE id = ?
";

$stmtMaster = $conn->prepare($sqlMaster);
$stmtMaster->bind_param("i", $master_id);
$stmtMaster->execute();
$stmtMaster->close();

/***********************************************************
 * 3) UPDATE DROP_LOG → rework_progress = COMPLETED
 ***********************************************************/
$sqlDrop = "
    UPDATE drop_log
    SET rework_progress = 'COMPLETED',
        completed_by = ?,
        completed_at = NOW()
    WHERE master_id = ?
    ORDER BY id DESC
    LIMIT 1
";

$stmtDrop = $conn->prepare($sqlDrop);
$stmtDrop->bind_param("si", $emp_id, $master_id);
$stmtDrop->execute();
$stmtDrop->close();

/***********************************************************
 * 4) LOG COMPLETION IN rework_log
 ***********************************************************/
$sqlLog = "
    INSERT INTO rework_log
    (master_id, stage_id, task_no, old_status, new_status, audio, updated_by)
    VALUES (?, 'ALL', 0, 'PROCESSING', 'COMPLETED', NULL, ?)
";

$stmtLog = $conn->prepare($sqlLog);
$stmtLog->bind_param("is", $master_id, $emp_id);
$stmtLog->execute();
$stmtLog->close();

/***********************************************************
 * 5) RESPONSE
 ***********************************************************/
echo json_encode([
    "status" => true,
    "message" => "Rework Completed Successfully!",
    "master_id" => $master_id
]);

$conn->close();
?>
