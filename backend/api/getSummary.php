<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

include "../config/db.php";

$date = $_GET['date'] ?? null;

if (!$date) {
    echo json_encode(["status" => false, "message" => "Date is required"]);
    exit;
}

$sql = "SELECT *
        FROM RearFrameAssyMaster
        WHERE DATE(created_at) = ?
        ORDER BY id DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$records = [];

while ($m = $result->fetch_assoc()) {

    $master_id = $m['id'];

    /* -------------------- CHECK DROPPED -------------------- */
    $sqlDrop = "SELECT stage_id
                FROM ConveyorSequence
                WHERE master_id = ? AND processed = 2
                LIMIT 1";

    $stmtDrop = $conn->prepare($sqlDrop);
    $stmtDrop->bind_param("i", $master_id);
    $stmtDrop->execute();
    $dropRes = $stmtDrop->get_result();

    $failedStage = null;
    if ($row = $dropRes->fetch_assoc()) {
        $failedStage = $row['stage_id'];   // e.g., 1R, 2INSP
    }

    $statusText = $failedStage 
                    ? "NOT OK (" . $failedStage . ")" 
                    : "OK";

    /* -------------------- REWORK STATUS -------------------- */
    $sqlRework = "SELECT id FROM ReworkTable WHERE master_id = ? LIMIT 1";
    $stmtRw = $conn->prepare($sqlRework);
    $stmtRw->bind_param("i", $master_id);
    $stmtRw->execute();
    $rwRes = $stmtRw->get_result();

    $reworkStatus = $rwRes->num_rows > 0 ? "REWORKED" : "CLEAR";

    /* -------------------- AUDIO -------------------- */
    $sqlAudio = "SELECT audio FROM RearFrameAssyStageTasks
                 WHERE master_id = ? AND audio IS NOT NULL AND audio != ''
                 LIMIT 1";

    $stmtA = $conn->prepare($sqlAudio);
    $stmtA->bind_param("i", $master_id);
    $stmtA->execute();
    $audioRes = $stmtA->get_result();

    $audioURL = null;
    if ($audioRes->num_rows > 0) {
        $audioName = $audioRes->fetch_assoc()['audio'];
        $audioURL = "http://localhost/AlRearFrameAssy/uploads/audio/" . $audioName;
    }

    /* -------------------- BUILD ROW -------------------- */
    $records[] = [
        "master_id"      => $master_id,
        "axle_serial_no" => $m["axle_serial_no"],
        "date"           => substr($m["created_at"], 0, 10),
        "status"         => $statusText,
        "rework_status"  => $reworkStatus,
        "audio_url"      => $audioURL
    ];
}

echo json_encode(["status" => true, "records" => $records]);

$stmt->close();
$conn->close();
?>
