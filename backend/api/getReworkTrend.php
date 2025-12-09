<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

date_default_timezone_set("Asia/Kolkata");
include "../config/db.php";

$sql = "
SELECT 
    DATE(drop_date) AS day,
    COUNT(*) AS sent,
    SUM(CASE WHEN rework_progress = 'COMPLETED' THEN 1 ELSE 0 END) AS completed
FROM drop_log
WHERE drop_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY DATE(drop_date)
ORDER BY day ASC
";

$res = $conn->query($sql);
$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = [
        "date" => date("M d", strtotime($row["day"])),
        "sent" => intval($row["sent"]),
        "completed" => intval($row["completed"])
    ];
}

echo json_encode(["status" => true, "data" => $data]);

$conn->close();
