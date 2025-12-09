<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

date_default_timezone_set("Asia/Kolkata");
include "../config/db.php";

$sql = "
SELECT 
    stage_id,
    COUNT(*) AS c
FROM drop_log
GROUP BY stage_id
ORDER BY c DESC
";

$res = $conn->query($sql);

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = [
        "stage" => "Stage " . $row["stage_id"],
        "count" => intval($row["c"])
    ];
}

echo json_encode(["status" => true, "data" => $data]);

$conn->close();
