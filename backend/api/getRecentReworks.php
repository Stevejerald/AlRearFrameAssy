<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

date_default_timezone_set("Asia/Kolkata");
include "../config/db.php";

$sql = "
SELECT 
    dl.id,
    dl.master_id,
    m.axle_serial_no,
    dl.stage_id,
    dl.rework_progress,
    dl.drop_date
FROM drop_log dl
JOIN rearframeassymaster m ON m.id = dl.master_id
ORDER BY dl.drop_date DESC
LIMIT 10
";

$res = $conn->query($sql);
$data = [];

while ($row = $res->fetch_assoc()) {
    $statusText = "";
    if ($row["rework_progress"] == "NOT_ACK") $statusText = "Pending";
    else if ($row["rework_progress"] == "PROCESSING") $statusText = "In Progress";
    else $statusText = "Completed";

    $data[] = [
        "id" => intval($row["id"]),
        "axle_no" => $row["axle_serial_no"],
        "stage" => "Stage " . $row["stage_id"],
        "status" => $statusText,
        "date" => date("Y-m-d", strtotime($row["drop_date"]))
    ];
}

echo json_encode(["status" => true, "data" => $data]);

$conn->close();
