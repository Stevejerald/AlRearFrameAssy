<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

date_default_timezone_set("Asia/Kolkata");

include "../config/db.php";

/***********************************************************
 * 1️⃣ DETECT CURRENT SHIFT (A or B)
 ***********************************************************/
$current_time = date("H:i");

if ($current_time >= "06:00" && $current_time < "14:00") {
    $current_shift = "A"; // Shift 1
} elseif ($current_time >= "14:00" && $current_time < "22:00") {
    $current_shift = "B"; // Shift 2
} else {
    $current_shift = "A"; // fallback
}

$full_shift_name = ($current_shift === "A") ? "Shift 1" : "Shift 2";

$today = date("Y-m-d");

/***********************************************************
 * 2️⃣ WORKPLAN - CURRENT SHIFT
 ***********************************************************/
$sql_wp = "SELECT count FROM workplan WHERE date = ? AND shift = ? LIMIT 1";
$stmt_wp = $conn->prepare($sql_wp);
$stmt_wp->bind_param("ss", $today, $full_shift_name);
$stmt_wp->execute();

$res_wp = $stmt_wp->get_result();
$workplan_count = ($res_wp->num_rows > 0) ? intval($res_wp->fetch_assoc()["count"]) : 0;

/***********************************************************
 * 3️⃣ CURRENT SHIFT ASSEMBLED
 ***********************************************************/
$sql_made = "
    SELECT COUNT(*) AS total
    FROM rearframeassymaster
    WHERE prod_date = ? AND prod_shift = ?
";
$stmt_made = $conn->prepare($sql_made);
$stmt_made->bind_param("ss", $today, $current_shift);
$stmt_made->execute();

$res_made = $stmt_made->get_result();
$current_shift_made = intval($res_made->fetch_assoc()["total"]);

/***********************************************************
 * 4️⃣ OK Assemblies (all processed=1)
 ***********************************************************/
$sql_ok = "
    SELECT COUNT(*) AS ok_count FROM (
        SELECT 
            master_id,
            CASE 
                WHEN MIN(CAST(processed AS UNSIGNED)) = 1 THEN 'Ok'
                ELSE 'Not Ok'
            END AS status
        FROM conveyorsequence
        GROUP BY master_id
    ) AS t
    WHERE status = 'Ok'
";
$res_ok = $conn->query($sql_ok);
$ok_assemblies = ($res_ok) ? intval($res_ok->fetch_assoc()["ok_count"]) : 0;

/***********************************************************
 * 5️⃣ NOT OK / DROPPED
 ***********************************************************/
$sql_drop = "SELECT COUNT(*) AS dropped FROM drop_log WHERE DATE(drop_date) = ?";
$stmt_drop = $conn->prepare($sql_drop);
$stmt_drop->bind_param("s", $today);
$stmt_drop->execute();

$res_drop = $stmt_drop->get_result();
$not_ok = intval($res_drop->fetch_assoc()["dropped"]);

/***********************************************************
 * 6️⃣ REWORKS RAISED (Not Completed)
 ***********************************************************/
$sql_rework = "
    SELECT COUNT(*) AS total_rework
    FROM drop_log
    WHERE rework_progress != 'COMPLETED'
";
$res_rework = $conn->query($sql_rework);
$reworks_raised = ($res_rework) ? intval($res_rework->fetch_assoc()["total_rework"]) : 0;

/***********************************************************
 * 7️⃣ Efficiency
 ***********************************************************/
$efficiency = 0;
if ($workplan_count > 0) {
    $efficiency = round(($current_shift_made / $workplan_count) * 100, 1);
}

/***********************************************************
 * 8️⃣ RearFrame Assy Workplan Summary (Shift 1 & 2)
 ***********************************************************/

/* A → Workplan Shift 1 */
$sql_A = "SELECT count FROM workplan WHERE date = ? AND shift='Shift 1' LIMIT 1";
$stmtA = $conn->prepare($sql_A);
$stmtA->bind_param("s", $today);
$stmtA->execute();
$resA = $stmtA->get_result();
$A = ($resA->num_rows > 0) ? intval($resA->fetch_assoc()["count"]) : 0;

/* B → Assembled in Shift A */
$sql_B = "
    SELECT COUNT(*) AS total
    FROM rearframeassymaster
    WHERE prod_date = ? AND prod_shift = 'A'
";
$stmtB = $conn->prepare($sql_B);
$stmtB->bind_param("s", $today);
$stmtB->execute();
$B = intval($stmtB->get_result()->fetch_assoc()["total"]);

/* C → Workplan Shift 2 */
$sql_C = "SELECT count FROM workplan WHERE date = ? AND shift='Shift 2' LIMIT 1";
$stmtC = $conn->prepare($sql_C);
$stmtC->bind_param("s", $today);
$stmtC->execute();
$resC = $stmtC->get_result();
$C = ($resC->num_rows > 0) ? intval($resC->fetch_assoc()["count"]) : 0;

/* D → Assembled in Shift B */
$sql_D = "
    SELECT COUNT(*) AS total
    FROM rearframeassymaster
    WHERE prod_date = ? AND prod_shift = 'B'
";
$stmtD = $conn->prepare($sql_D);
$stmtD->bind_param("s", $today);
$stmtD->execute();
$D = intval($stmtD->get_result()->fetch_assoc()["total"]);

/***********************************************************
 * 8️⃣ ALERTS (Last 3 stage failures)
 ***********************************************************/
$sql_alerts = "
    SELECT stage_id 
    FROM rearframeassystagetasks 
    WHERE status = 'no'
    ORDER BY id DESC
    LIMIT 3
";



$res_alerts = $conn->query($sql_alerts);

$alerts = [];
if ($res_alerts && $res_alerts->num_rows > 0) {
    while ($row = $res_alerts->fetch_assoc()) {
        $alerts[] = "Stage " . $row["stage_id"] . " failure";
    }
}

/***********************************************************
 * 9️⃣ OK vs NOT OK Trend - Last 7 Days
 ***********************************************************/

// ---- OK TREND ----
$sql_ok_trend = "
    SELECT 
        t.created_date,
        COUNT(*) AS ok_master_count
    FROM (
        SELECT 
            r.master_id,
            DATE(r.created_date) AS created_date
        FROM rearframeassystagetasks r
        GROUP BY r.master_id, DATE(r.created_date)
        HAVING 
            NOT EXISTS (SELECT 1 FROM drop_log d WHERE d.master_id = r.master_id)
            AND NOT EXISTS (SELECT 1 FROM not_ok_log n WHERE n.master_id = r.master_id)
            AND (
                SELECT MIN(processed)
                FROM conveyorsequence c
                WHERE c.master_id = r.master_id
            ) = 1
    ) AS t
    WHERE t.created_date >= CURDATE() - INTERVAL 7 DAY
    GROUP BY t.created_date
    ORDER BY t.created_date
";

$res_ok_trend = $conn->query($sql_ok_trend);
$ok_trend = [];
if ($res_ok_trend) {
    while ($row = $res_ok_trend->fetch_assoc()) {
        $ok_trend[$row["created_date"]] = intval($row["ok_master_count"]);
    }
}


// ---- NOT OK TREND ----
$sql_not_ok_trend = "
    SELECT 
        DATE(created_date) AS created_date,
        COUNT(DISTINCT master_id) AS not_ok_count
    FROM not_ok_log
    WHERE created_date >= CURDATE() - INTERVAL 7 DAY
    GROUP BY DATE(created_date)
    ORDER BY created_date
";

$res_not_ok_trend = $conn->query($sql_not_ok_trend);
$not_ok_trend = [];
if ($res_not_ok_trend) {
    while ($row = $res_not_ok_trend->fetch_assoc()) {
        $not_ok_trend[$row["created_date"]] = intval($row["not_ok_count"]);
    }
}


// ---- MERGE BOTH ----
$trend_output = [];

$start = new DateTime('-6 days');  
$end   = new DateTime();           

for ($d = $start; $d <= $end; $d->modify('+1 day')) {
    $date = $d->format("Y-m-d");

    $trend_output[$date] = [
        "ok_count"     => $ok_trend[$date]     ?? 0,
        "not_ok_count" => $not_ok_trend[$date] ?? 0
    ];
}

/***********************************************************
 * 🔟 THIS MONTH QUALITY STATUS
 ***********************************************************/

// ---------------------------------------------------------
// 1️⃣ Passed Without Fault (This Month)
// ---------------------------------------------------------
$sql_passed_month = "
    SELECT 
        COUNT(*) AS ok_master_count_month
    FROM (
        SELECT 
            r.master_id
        FROM rearframeassystagetasks r
        GROUP BY r.master_id
        HAVING 
            NOT EXISTS (SELECT 1 FROM drop_log d WHERE d.master_id = r.master_id)
            AND NOT EXISTS (SELECT 1 FROM not_ok_log n WHERE n.master_id = r.master_id)
            AND (
                SELECT MIN(processed)
                FROM conveyorsequence c
                WHERE c.master_id = r.master_id
            ) = 1
    ) AS t
    WHERE 
        t.master_id IN (
            SELECT master_id
            FROM rearframeassystagetasks
            WHERE created_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
            AND created_date <  DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
        )
";

$res_passed_month = $conn->query($sql_passed_month);
$passed_without_fault = ($res_passed_month) 
    ? intval($res_passed_month->fetch_assoc()["ok_master_count_month"]) 
    : 0;



// ---------------------------------------------------------
// 2️⃣ Rework Count (This Month)
// ---------------------------------------------------------
$sql_rework_month = "
    SELECT COUNT(*) AS total 
    FROM rework_log
    WHERE MONTH(created_date) = MONTH(CURDATE())
      AND YEAR(created_date) = YEAR(CURDATE())
";

$res_rework_month = $conn->query($sql_rework_month);
$rework_count = ($res_rework_month) ? intval($res_rework_month->fetch_assoc()["total"]) : 0;


// ---------------------------------------------------------
// 3️⃣ Drop Count (This Month)
// ---------------------------------------------------------
$sql_drop_month = "
    SELECT COUNT(*) AS total
    FROM drop_log
    WHERE MONTH(created_date) = MONTH(CURDATE())
      AND YEAR(created_date) = YEAR(CURDATE())
";

$res_drop_month = $conn->query($sql_drop_month);
$drop_count = ($res_drop_month) ? intval($res_drop_month->fetch_assoc()["total"]) : 0;


// ---------------------------------------------------------
// 4️⃣ Assembled With Fault (Not OK) (This Month)
// ---------------------------------------------------------
$sql_fault_month = "
    SELECT COUNT(*) AS total
    FROM not_ok_log
    WHERE MONTH(created_date) = MONTH(CURDATE())
      AND YEAR(created_date) = YEAR(CURDATE())
";

$res_fault_month = $conn->query($sql_fault_month);
$fault_count = ($res_fault_month) ? intval($res_fault_month->fetch_assoc()["total"]) : 0;

/***********************************************************
 * 1️⃣1️⃣ STAGE FAILURE ANALYSIS (THIS MONTH)
 ***********************************************************/

$sql_stage_failure = "
    SELECT 
        stage_id,
        COUNT(*) AS count
    FROM not_ok_log
    WHERE 
        MONTH(created_date) = MONTH(CURDATE())
        AND YEAR(created_date) = YEAR(CURDATE())
    GROUP BY stage_id
    ORDER BY stage_id
";

$res_stage_failure = $conn->query($sql_stage_failure);

$stage_failure_analysis = [];

if ($res_stage_failure) {
    while ($row = $res_stage_failure->fetch_assoc()) {
        $stage_failure_analysis[] = [
            "stage_id" => $row["stage_id"],           // ⬅ KEEP AS STRING
            "count"    => intval($row["count"])       // numeric count
        ];
    }
}

/***********************************************************
 * 1️⃣2️⃣ TEAM PERFORMANCE (TODAY)
 ***********************************************************/

// ---------------------------------------------------------
// TOTAL Assemblies Today
// ---------------------------------------------------------
$sql_tp_total = "
    SELECT COUNT(*) AS total
    FROM rearframeassymaster
    WHERE prod_date = CURDATE()
";

$res_tp_total = $conn->query($sql_tp_total);
$tp_total = ($res_tp_total) ? intval($res_tp_total->fetch_assoc()["total"]) : 0;


// ---------------------------------------------------------
// SHIFT 1 Assemblies Today (Shift A)
// ---------------------------------------------------------
$sql_tp_shift1 = "
    SELECT COUNT(*) AS total
    FROM rearframeassymaster
    WHERE prod_date = CURDATE() AND prod_shift = 'A'
";

$res_tp_shift1 = $conn->query($sql_tp_shift1);
$tp_shift1 = ($res_tp_shift1) ? intval($res_tp_shift1->fetch_assoc()["total"]) : 0;


// ---------------------------------------------------------
// SHIFT 2 Assemblies Today (Shift B or C)
// ---------------------------------------------------------
$sql_tp_shift2 = "
    SELECT COUNT(*) AS total
    FROM rearframeassymaster
    WHERE prod_date = CURDATE()
      AND (prod_shift = 'B' OR prod_shift = 'C')
";

$res_tp_shift2 = $conn->query($sql_tp_shift2);
$tp_shift2 = ($res_tp_shift2) ? intval($res_tp_shift2->fetch_assoc()["total"]) : 0;

$sql_shift_prod = "
    SELECT 'yesterday_shift_1' AS label, COUNT(*) AS total
    FROM rearframeassymaster
    WHERE prod_date = CURDATE() - INTERVAL 1 DAY AND prod_shift = 'A'
    
    UNION ALL
    
    SELECT 'yesterday_shift_2', COUNT(*)
    FROM rearframeassymaster
    WHERE prod_date = CURDATE() - INTERVAL 1 DAY AND prod_shift IN ('B','C')
    
    UNION ALL
    
    SELECT 'today_shift_1', COUNT(*)
    FROM rearframeassymaster
    WHERE prod_date = CURDATE() AND prod_shift = 'A'
    
    UNION ALL
    
    SELECT 'today_shift_2', COUNT(*)
    FROM rearframeassymaster
    WHERE prod_date = CURDATE() AND prod_shift IN ('B','C')
";
$res_shift_prod = $conn->query($sql_shift_prod);
$shift_production = [];

if ($res_shift_prod) {
    while ($row = $res_shift_prod->fetch_assoc()) {
        $shift_production[$row["label"]] = intval($row["total"]);
    }
}

$sql_shift_ok = "
(
SELECT 'yesterday_shift_1_ok' AS label, COUNT(*) AS ok_master_count
FROM (
    SELECT r.master_id 
    FROM rearframeassystagetasks r
    JOIN rearframeassymaster m ON r.master_id = m.id
    WHERE DATE(r.created_date) = CURDATE() - INTERVAL 1 DAY
    GROUP BY r.master_id
    HAVING 
        NOT EXISTS (SELECT 1 FROM drop_log d WHERE d.master_id = r.master_id)
        AND NOT EXISTS (SELECT 1 FROM not_ok_log n WHERE n.master_id = r.master_id)
        AND NOT EXISTS (SELECT 1 FROM rework_log rl WHERE rl.master_id = r.master_id)
        AND (SELECT MIN(processed) FROM conveyorsequence c WHERE c.master_id = r.master_id) = 1
) AS t
JOIN rearframeassymaster m2 ON m2.id = t.master_id
WHERE m2.prod_shift = 'A'
)

UNION ALL

(
SELECT 'yesterday_shift_2_ok', COUNT(*)
FROM (
    SELECT r.master_id 
    FROM rearframeassystagetasks r
    JOIN rearframeassymaster m ON r.master_id = m.id
    WHERE DATE(r.created_date) = CURDATE() - INTERVAL 1 DAY
    GROUP BY r.master_id
    HAVING 
        NOT EXISTS (SELECT 1 FROM drop_log d WHERE d.master_id = r.master_id)
        AND NOT EXISTS (SELECT 1 FROM not_ok_log n WHERE n.master_id = r.master_id)
        AND NOT EXISTS (SELECT 1 FROM rework_log rl WHERE rl.master_id = r.master_id)
        AND (SELECT MIN(processed) FROM conveyorsequence c WHERE c.master_id = r.master_id) = 1
) AS t
JOIN rearframeassymaster m2 ON m2.id = t.master_id
WHERE m2.prod_shift IN ('B','C')
)

UNION ALL

(
SELECT 'today_shift_1_ok', COUNT(*)
FROM (
    SELECT r.master_id 
    FROM rearframeassystagetasks r
    JOIN rearframeassymaster m ON r.master_id = m.id
    WHERE DATE(r.created_date) = CURDATE()
    GROUP BY r.master_id
    HAVING 
        NOT EXISTS (SELECT 1 FROM drop_log d WHERE d.master_id = r.master_id)
        AND NOT EXISTS (SELECT 1 FROM not_ok_log n WHERE n.master_id = r.master_id)
        AND NOT EXISTS (SELECT 1 FROM rework_log rl WHERE rl.master_id = r.master_id)
        AND (SELECT MIN(processed) FROM conveyorsequence c WHERE c.master_id = r.master_id) = 1
) AS t
JOIN rearframeassymaster m2 ON m2.id = t.master_id
WHERE m2.prod_shift = 'A'
)

UNION ALL

(
SELECT 'today_shift_2_ok', COUNT(*)
FROM (
    SELECT r.master_id 
    FROM rearframeassystagetasks r
    JOIN rearframeassymaster m ON r.master_id = m.id
    WHERE DATE(r.created_date) = CURDATE()
    GROUP BY r.master_id
    HAVING 
        NOT EXISTS (SELECT 1 FROM drop_log d WHERE d.master_id = r.master_id)
        AND NOT EXISTS (SELECT 1 FROM not_ok_log n WHERE n.master_id = r.master_id)
        AND NOT EXISTS (SELECT 1 FROM rework_log rl WHERE rl.master_id = r.master_id)
        AND (SELECT MIN(processed) FROM conveyorsequence c WHERE c.master_id = r.master_id) = 1
) AS t
JOIN rearframeassymaster m2 ON m2.id = t.master_id
WHERE m2.prod_shift IN ('B','C')
)
";

$res_shift_ok = $conn->query($sql_shift_ok);
$shift_ok = [];

if ($res_shift_ok) {
    while ($row = $res_shift_ok->fetch_assoc()) {
        $shift_ok[$row["label"]] = intval($row["ok_master_count"]);
    }
}


$sql_shift_not_ok = "
(
SELECT 'yesterday_shift_1' AS label,
       COUNT(DISTINCT n.master_id) AS total
FROM not_ok_log n
JOIN rearframeassymaster m ON m.id = n.master_id
WHERE DATE(n.created_date) = CURDATE() - INTERVAL 1 DAY
  AND m.prod_shift = 'A'
)

UNION ALL

(
SELECT 'yesterday_shift_2', COUNT(DISTINCT n.master_id)
FROM not_ok_log n
JOIN rearframeassymaster m ON m.id = n.master_id
WHERE DATE(n.created_date) = CURDATE() - INTERVAL 1 DAY
  AND m.prod_shift IN ('B','C')
)

UNION ALL

(
SELECT 'today_shift_1', COUNT(DISTINCT n.master_id)
FROM not_ok_log n
JOIN rearframeassymaster m ON m.id = n.master_id
WHERE DATE(n.created_date) = CURDATE()
  AND m.prod_shift = 'A'
)

UNION ALL

(
SELECT 'today_shift_2', COUNT(DISTINCT n.master_id)
FROM not_ok_log n
JOIN rearframeassymaster m ON m.id = n.master_id
WHERE DATE(n.created_date) = CURDATE()
  AND m.prod_shift IN ('B','C')
)
";


$res_shift_not_ok = $conn->query($sql_shift_not_ok);
$shift_not_ok = [];

if ($res_shift_not_ok) {
    while ($row = $res_shift_not_ok->fetch_assoc()) {
        $shift_not_ok[$row["label"]] = intval($row["total"]);
    }
}

/* Rework trend */
$sql_rework_trend = "
WITH weeks AS (
    SELECT 1 AS week_number UNION ALL
    SELECT 2 UNION ALL
    SELECT 3 UNION ALL
    SELECT 4
),
rework_data AS (
    SELECT 
        WEEK(created_date, 1) 
          - WEEK(DATE_FORMAT(created_date, '%Y-%m-01'), 1) 
          + 1 AS week_number,
        COUNT(DISTINCT master_id) AS total
    FROM rework_log
    WHERE MONTH(created_date) = MONTH(CURDATE())
      AND YEAR(created_date) = YEAR(CURDATE())
    GROUP BY week_number
)
SELECT 
    w.week_number,
    COALESCE(r.total, 0) AS total
FROM weeks w
LEFT JOIN rework_data r ON r.week_number = w.week_number
ORDER BY w.week_number
";

$res_rework_trend = $conn->query($sql_rework_trend);

$rework_trend = [];

if ($res_rework_trend) {
    while ($row = $res_rework_trend->fetch_assoc()) {
        $week = "week_" . intval($row["week_number"]);
        $rework_trend[$week] = intval($row["total"]);
    }
}





/***********************************************************
 * FINAL RESPONSE
 ***********************************************************/
echo json_encode([
    "status" => true,
    "data" => [
        "current_shift"      => $current_shift,
        "workplan_count"     => $workplan_count,
        "current_shift_made" => $current_shift_made,
        "ok_assemblies"      => $ok_assemblies,
        "not_ok"             => $not_ok,
        "reworks_raised"     => $reworks_raised,
        "efficiency"         => $efficiency,

        "workplan_summary" => [
            "shift_1" => [
                "workplan"  => $A,
                "assembled" => $B
            ],
            "shift_2" => [
                "workplan"  => $C,
                "assembled" => $D
            ]
        ],

        "alerts" => $alerts,

        "ok_notok_trend" => $trend_output,

        "this_month_quality" => [
            "passed_without_fault" => $passed_without_fault,
            "rework"               => $rework_count,
            "drop"                 => $drop_count,
            "assembled_with_fault" => $fault_count
        ],

        "stage_failure_analysis" => $stage_failure_analysis,

        "team_performance" => [
            "total"   => $tp_total,
            "shift_1" => $tp_shift1,
            "shift_2" => $tp_shift2
        ],
        "team_performance_shift" => [
            "production" => $shift_production,
            "ok"         => $shift_ok,
            "not_ok"     => $shift_not_ok
        ],
        "rework_completion_trend" => $rework_trend,


    ]
]);

$conn->close();
?>
