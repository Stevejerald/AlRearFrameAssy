<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

date_default_timezone_set("Asia/Kolkata");

include "../config/db.php";

$master_id = $_GET["master_id"] ?? null;

if (!$master_id) {
    echo json_encode(["status" => false, "message" => "master_id required"]);
    exit;
}

/******************************************************
 * 1) FETCH MASTER DATA
 ******************************************************/
$sql = "SELECT 
            id,
            stage_id,
            prod_date,
            prod_shift,
            axle_serial_no,
            axle_spec,
            axle_casing_part_no,
            brake_part_no_lh,
            brake_part_no_rh,
            cwp_diff_carrier_no,
            axle_qr,
            brake_qr,
            hub_qr,
            abs_qr
        FROM rearframeassymaster
        WHERE id = ?
        LIMIT 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $master_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => false, "message" => "Master record not found"]);
    exit;
}

$master = $result->fetch_assoc();


/******************************************************
 * 2) FETCH ONLY FAILED TASKS (status = 'no')
 ******************************************************/

$sql2 = "
    SELECT 
        stage_id,
        task_no,
        description,
        status,
        audio
    FROM rearframeassystagetasks
    WHERE master_id = ?
      AND status = 'no'
    ORDER BY stage_id, task_no
";

$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("i", $master_id);
$stmt2->execute();
$res2 = $stmt2->get_result();

$failed_tasks = [];

while ($row = $res2->fetch_assoc()) {
    $failed_tasks[] = [
        "stage_id"    => $row["stage_id"],
        "task_no"     => intval($row["task_no"]),
        "description" => $row["description"],
        "status"      => $row["status"],
        "audio"       => $row["audio"] ? $row["audio"] : null
    ];
}


/******************************************************
 * 3) RESPONSE
 ******************************************************/
echo json_encode([
    "status" => true,
    "master" => $master,
    "failed_tasks" => $failed_tasks
]);

$stmt->close();
$stmt2->close();
$conn->close();
?>
