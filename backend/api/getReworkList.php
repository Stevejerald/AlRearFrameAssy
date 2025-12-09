<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

date_default_timezone_set("Asia/Kolkata");

include "../config/db.php";

$date = $_GET["date"] ?? null;

if (!$date) {
    echo json_encode([
        "status" => false,
        "message" => "date required"
    ]);
    exit;
}

/****************************************************
 * Fetch ALL rework records:
 *    - NOT_ACK
 *    - PROCESSING
 *    - COMPLETED
 *
 * From drop_log (because rework team works on drop items)
 *
 * Filter:
 *    prod_date = selected date OR
 *    drop_date = selected date
 ****************************************************/

$sql = "
SELECT 
    m.id AS master_id,
    m.axle_serial_no,
    m.prod_date,
    dl.drop_date,
    dl.stage_id,
    dl.reason,
    dl.rework_progress,
    (
        SELECT COUNT(*) FROM rearframeassystagetasks rst
        WHERE rst.master_id = m.id AND rst.audio IS NOT NULL
    ) AS has_audio
FROM rearframeassymaster m
JOIN drop_log dl ON dl.master_id = m.id
WHERE (m.prod_date = ? OR dl.drop_date = ?)
ORDER BY 
    FIELD(dl.rework_progress, 'NOT_ACK', 'PROCESSING', 'COMPLETED'),
    dl.drop_date ASC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $date, $date);
$stmt->execute();

$res = $stmt->get_result();

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = [
        "master_id" => intval($row["master_id"]),
        "axle_serial_no" => $row["axle_serial_no"],
        "prod_date" => $row["prod_date"],
        "drop_date" => $row["drop_date"],
        "stage_id" => $row["stage_id"],
        "reason" => $row["reason"],
        "rework_progress" => $row["rework_progress"],
        "has_audio" => ($row["has_audio"] > 0)
    ];
}

echo json_encode([
    "status" => true,
    "data" => $data
]);

$stmt->close();
$conn->close();
?>
