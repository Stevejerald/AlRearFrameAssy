<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

include "../config/db.php";

$response = [
    "status" => true,
    "stats" => [],
    "ok_not_ok" => [],
    "stage_failures" => [],
    "rework_trend" => []
];

/* ---------------------------------------------------------
   1. KPI – TOTAL / OK / NOT OK / REWORK
--------------------------------------------------------- */

// Total assemblies (today)
$sql1 = "
    SELECT COUNT(*) AS total
    FROM RearFrameAssyMaster
    WHERE DATE(created_at) = CURDATE()
";
$res1 = $conn->query($sql1);
$total = $res1->fetch_assoc()["total"] ?? 0;

// OK assemblies = no dropped stages for that master
$sql2 = "
    SELECT COUNT(*) AS ok_count
    FROM RearFrameAssyMaster m
    WHERE DATE(m.created_at) = CURDATE()
      AND NOT EXISTS (
          SELECT 1 FROM ConveyorSequence cs
          WHERE cs.master_id = m.id AND cs.dropped = 1
      )
";
$res2 = $conn->query($sql2);
$ok_count = $res2->fetch_assoc()["ok_count"] ?? 0;

$not_ok_count = $total - $ok_count;

// Rework count
$sql3 = "
    SELECT COUNT(*) AS rcount
    FROM rework_log
    WHERE DATE(created_at) = CURDATE()
";
$res3 = $conn->query($sql3);
$rework_count = $res3->fetch_assoc()["rcount"] ?? 0;

$response["stats"] = [
    "total_assemblies" => (int)$total,
    "ok_assemblies" => (int)$ok_count,
    "not_ok_assemblies" => (int)$not_ok_count,
    "rework_count" => (int)$rework_count
];

/* ---------------------------------------------------------
   2. OK vs NOT OK for last 7 days
--------------------------------------------------------- */

$sql4 = "
    SELECT 
        DATE(m.created_at) AS date,
        SUM(
            NOT EXISTS (
                SELECT 1 FROM ConveyorSequence cs 
                WHERE cs.master_id = m.id AND cs.dropped = 1
            )
        ) AS ok_count,
        SUM(
            EXISTS (
                SELECT 1 FROM ConveyorSequence cs 
                WHERE cs.master_id = m.id AND cs.dropped = 1
            )
        ) AS notok_count
    FROM RearFrameAssyMaster m
    WHERE DATE(m.created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(m.created_at)
    ORDER BY date ASC
";

$res4 = $conn->query($sql4);
$ok_not_ok = [];

while ($row = $res4->fetch_assoc()) {
    $ok_not_ok[] = [
        "date" => $row["date"],
        "ok" => (int)$row["ok_count"],
        "not_ok" => (int)$row["notok_count"]
    ];
}

$response["ok_not_ok"] = $ok_not_ok;

/* ---------------------------------------------------------
   3. Stage Failure Count (Which stage dropped?)
--------------------------------------------------------- */

$sql5 = "
    SELECT stage_id, COUNT(*) AS failures
    FROM ConveyorSequence
    WHERE dropped = 1
    GROUP BY stage_id
    ORDER BY stage_id ASC
";

$res5 = $conn->query($sql5);
$stage_failures = [];

while ($row = $res5->fetch_assoc()) {
    $stage_failures[] = [
        "stage" => $row["stage_id"],
        "failures" => (int)$row["failures"]
    ];
}

$response["stage_failures"] = $stage_failures;

/* ---------------------------------------------------------
   4. Rework Trend (Last 7 Days)
--------------------------------------------------------- */

$sql6 = "
    SELECT DATE(created_at) AS date, COUNT(*) AS reworks
    FROM rework_log
    WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date ASC
";

$res6 = $conn->query($sql6);
$trend = [];

while ($row = $res6->fetch_assoc()) {
    $trend[] = [
        "date" => $row["date"],
        "reworks" => (int)$row["reworks"]
    ];
}

$response["rework_trend"] = $trend;

/* ---------------------------------------------------------
   FINAL OUTPUT
--------------------------------------------------------- */

echo json_encode($response);
$conn->close();
?>
