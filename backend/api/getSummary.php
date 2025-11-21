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

// FORMAT: "YYYY-MM-DD"
$sql = "
    SELECT 
        m.id AS master_id,
        m.axle_serial_no,
        DATE(m.created_at) AS created_date
    FROM RearFrameAssyMaster m
    WHERE DATE(m.created_at) = ?
    ORDER BY m.id ASC
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["status" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$rows = [];

while ($row = $result->fetch_assoc()) {

    $master_id = $row['master_id'];

    // ------------------------------------------------
    // FIND IF ANY STAGE IS DROPPED
    // ------------------------------------------------
    $sql2 = "
        SELECT dropped, stage_id
        FROM ConveyorSequence
        WHERE master_id = ?
    ";

    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("i", $master_id);
    $stmt2->execute();
    $res2 = $stmt2->get_result();

    $status = "OK";
    $notOkStage = null;

    while ($r = $res2->fetch_assoc()) {
        if ($r['dropped'] == 1) {
            $status = "NOT OK (" . $r['stage_id'] . ")";
            $notOkStage = $r['stage_id'];
        }
    }

    // ----------------------------------------------------
    // CHECK IF ANY AUDIO EXISTS (IMPROVED DETECTION)
    // ----------------------------------------------------
    $sql3 = "
        SELECT audio
        FROM RearFrameAssyStageTasks
        WHERE master_id = ?
          AND audio IS NOT NULL
          AND LENGTH(audio) > 20
        LIMIT 1
    ";

    $stmt3 = $conn->prepare($sql3);
    $stmt3->bind_param("i", $master_id);
    $stmt3->execute();
    $res3 = $stmt3->get_result();

    $audioAvailable = $res3->num_rows > 0 ? true : false;

    // ----------------------------------------------------
    // REWORK STATUS
    // ----------------------------------------------------
    $reworkStatus = $status === "OK" ? "CLEAR" : "PENDING";


    $rows[] = [
        "master_id" => $master_id,
        "axle_serial_no" => $row["axle_serial_no"],
        "date" => $row["created_date"],
        "status" => $status,
        "rework_status" => $reworkStatus,
        "audio" => $audioAvailable,
    ];
}

echo json_encode([
    "status" => true,
    "data" => $rows
]);

$stmt->close();
$conn->close();
?>
