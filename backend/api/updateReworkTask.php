<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

date_default_timezone_set("Asia/Kolkata");

include "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);

$master_id = $input['master_id'] ?? null;
$stage_id  = $input['stage_id'] ?? null;
$task_no   = $input['task_no'] ?? null;
$new_status = $input['status'] ?? null;
$audio     = $input['audio'] ?? null;
$emp_id    = $input['emp_id'] ?? 'REWORK_TEAM'; // Optional identity

if (!$master_id || !$stage_id || !$task_no || !$new_status) {
    echo json_encode(["status" => false, "message" => "Missing required parameters"]);
    exit;
}

/******************************************************
 * 1. GET OLD STATUS (before updating)
 ******************************************************/
$sqlOld = "SELECT status FROM rearframeassystagetasks 
           WHERE master_id = ? AND stage_id = ? AND task_no = ? 
           LIMIT 1";

$stmtOld = $conn->prepare($sqlOld);
$stmtOld->bind_param("isi", $master_id, $stage_id, $task_no);
$stmtOld->execute();
$resOld = $stmtOld->get_result();

if ($resOld->num_rows === 0) {
    echo json_encode(["status" => false, "message" => "Task not found"]);
    exit;
}

$rowOld = $resOld->fetch_assoc();
$old_status = $rowOld['status'];
$stmtOld->close();

/******************************************************
 * 2. UPDATE TASK STATUS + AUDIO
 ******************************************************/
$sqlUpdate = "
    UPDATE rearframeassystagetasks 
    SET status = ?, audio = ?
    WHERE master_id = ? AND stage_id = ? AND task_no = ?
";

$stmtUpdate = $conn->prepare($sqlUpdate);
$stmtUpdate->bind_param(
    "ssisi",
    $new_status,
    $audio,
    $master_id,
    $stage_id,
    $task_no
);
$stmtUpdate->execute();
$stmtUpdate->close();

/******************************************************
 * 3. INSERT INTO rework_log (History Logging)
 ******************************************************/
$sqlLog = "
    INSERT INTO rework_log
    (master_id, stage_id, task_no, old_status, new_status, audio, updated_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
";

$stmtLog = $conn->prepare($sqlLog);
$stmtLog->bind_param(
    "isissss",
    $master_id,
    $stage_id,
    $task_no,
    $old_status,
    $new_status,
    $audio,
    $emp_id
);
$stmtLog->execute();
$stmtLog->close();

/******************************************************
 * 4. RESPONSE
 ******************************************************/
echo json_encode([
    "status" => true,
    "message" => "Task updated successfully",
    "updated_status" => $new_status
]);

$conn->close();
?>
