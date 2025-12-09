<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

date_default_timezone_set("Asia/Kolkata");
include "../config/db.php";

/********************************************
 * TOTAL REWORK = count of all drop_log entries
 ********************************************/
$total = $conn->query("SELECT COUNT(*) AS c FROM drop_log")->fetch_assoc()["c"];

/********************************************
 * PENDING = rework_progress = NOT_ACK
 ********************************************/
$pending = $conn->query("
    SELECT COUNT(*) AS c 
    FROM drop_log 
    WHERE rework_progress = 'NOT_ACK'
")->fetch_assoc()["c"];

/********************************************
 * IN PROGRESS = rework_progress = PROCESSING
 ********************************************/
$progress = $conn->query("
    SELECT COUNT(*) AS c 
    FROM drop_log 
    WHERE rework_progress = 'PROCESSING'
")->fetch_assoc()["c"];

/********************************************
 * COMPLETED = rework_progress = COMPLETED
 ********************************************/
$completed = $conn->query("
    SELECT COUNT(*) AS c 
    FROM drop_log 
    WHERE rework_progress = 'COMPLETED'
")->fetch_assoc()["c"];

echo json_encode([
    "status" => true,
    "data" => [
        "total_rework" => intval($total),
        "pending_rework" => intval($pending),
        "completed_rework" => intval($completed),
        "in_progress" => intval($progress)
    ]
]);

$conn->close();
