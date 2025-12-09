<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

date_default_timezone_set("Asia/Kolkata");
include "../config/db.php";

/* Helper function */
function formatStatus($status) {
    switch ($status) {
        case "NOT_ACK": return "Pending";
        case "PROCESSING": return "In Progress";
        case "COMPLETED": return "Completed";
        default: return $status;
    }
}

/***************************************
 * 1️⃣ TOTAL REWORK (till date)
 ***************************************/
$sql_total = "
    SELECT 
        (
            (SELECT COUNT(*) FROM drop_log) +
            (SELECT COUNT(*) FROM rearframeassymaster WHERE rework_status = 'PENDING')
        ) AS total_rework
";
$res_total = $conn->query($sql_total);
$total = $res_total->fetch_assoc()["total_rework"] ?? 0;

/***************************************
 * 2️⃣ PENDING REWORK (NOT_ACK)
 ***************************************/
$sql_pending = "SELECT COUNT(*) AS cnt FROM drop_log WHERE rework_progress = 'NOT_ACK'";
$res_pending = $conn->query($sql_pending);
$pending = $res_pending->fetch_assoc()["cnt"] ?? 0;

/***************************************
 * 3️⃣ IN PROGRESS (PROCESSING)
 ***************************************/
$sql_progress = "SELECT COUNT(*) AS cnt FROM drop_log WHERE rework_progress = 'PROCESSING'";
$res_progress = $conn->query($sql_progress);
$progress = $res_progress->fetch_assoc()["cnt"] ?? 0;

/***************************************
 * 4️⃣ COMPLETED (COMPLETED)
 ***************************************/
$sql_completed = "SELECT COUNT(*) AS cnt FROM drop_log WHERE rework_progress = 'COMPLETED'";
$res_completed = $conn->query($sql_completed);
$completed = $res_completed->fetch_assoc()["cnt"] ?? 0;

/***************************************
 * 5️⃣ REWORK TREND (last 7 days)
 ***************************************/
$sql_trend = "
SELECT 
    DATE(drop_date) AS day,
    COUNT(*) AS sent,
    SUM(CASE WHEN rework_progress = 'COMPLETED' THEN 1 ELSE 0 END) AS completed
FROM drop_log
WHERE drop_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY DATE(drop_date)
ORDER BY day ASC
";
$res_trend = $conn->query($sql_trend);

$trend = [];
while ($row = $res_trend->fetch_assoc()) {
    $trend[] = [
        "date" => date("M d", strtotime($row["day"])),
        "sent" => intval($row["sent"]),
        "completed" => intval($row["completed"])
    ];
}

/***************************************
 * 6️⃣ STAGE-WISE REWORK BREAKDOWN
 ***************************************/
$sql_stage = "
SELECT 
    stage_id,
    COUNT(*) AS cnt
FROM drop_log
GROUP BY stage_id
ORDER BY stage_id ASC
";

$res_stage = $conn->query($sql_stage);
$stage_break = [];

while ($row = $res_stage->fetch_assoc()) {
    $stage_break[] = [
        "stage" => "Stage " . $row["stage_id"],
        "count" => intval($row["cnt"])
    ];
}

/***************************************
 * 7️⃣ RECENT 10 REWORK RECORDS
 ***************************************/
$sql_recent = "
SELECT 
    dl.id,
    m.axle_serial_no,
    dl.stage_id,
    dl.rework_progress,
    dl.drop_date
FROM drop_log dl
JOIN rearframeassymaster m ON dl.master_id = m.id
ORDER BY dl.drop_date DESC
LIMIT 10
";

$res_recent = $conn->query($sql_recent);
$recent = [];

while ($row = $res_recent->fetch_assoc()) {
    $recent[] = [
        "id" => intval($row["id"]),
        "axle_no" => $row["axle_serial_no"],
        "stage" => "Stage " . $row["stage_id"],
        "status" => formatStatus($row["rework_progress"]),
        "date" => $row["drop_date"]
    ];
}

/***************************************
 * FINAL RESPONSE
 ***************************************/
echo json_encode([
    "status" => true,
    "data" => [
        "stats" => [
            "total_rework"      => intval($total),
            "pending_rework"    => intval($pending),
            "in_progress"       => intval($progress),
            "completed_rework"  => intval($completed)
        ],
        "trend"            => $trend,
        "stage_breakdown"  => $stage_break,
        "recent_reworks"   => $recent
    ]
]);

$conn->close();
?>
