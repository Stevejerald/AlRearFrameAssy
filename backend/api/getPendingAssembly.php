<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

date_default_timezone_set("Asia/Kolkata");  // 🔥 INDIA TIMEZONE

include "../config/db.php";

$stage_id = $_GET['stage_id'] ?? null;

if (!$stage_id) {
    echo json_encode(["status" => false, "message" => "stage_id is required"]);
    exit;
}

/****************************************
 * DETERMINE TODAY DATE + SHIFT
 ****************************************/
$today = date("Y-m-d");
$hour = intval(date("H"));

if ($hour >= 6 && $hour < 14) {
    $shift = "A";
} elseif ($hour >= 14 && $hour < 22) {
    $shift = "B";
} else {
    $shift = "C";
}

/****************************************
 * FETCH ASSEMBLY FOR THIS STAGE
 * ONLY TODAY + CURRENT SHIFT
 ****************************************/

$sql = "SELECT cs.id AS sequence_id, cs.master_id, m.*
        FROM ConveyorSequence cs
        JOIN RearFrameAssyMaster m ON cs.master_id = m.id
        WHERE cs.stage_id = ?
          AND cs.processed = 0
          AND cs.dropped = 0
          AND m.prod_date = ?
          AND m.prod_shift = ?
        ORDER BY cs.id ASC
        LIMIT 1";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param("sss", $stage_id, $today, $shift);
$stmt->execute();
$result = $stmt->get_result();

if (!$row = $result->fetch_assoc()) {
    echo json_encode([
        "status" => false,
        "message" => "No pending assembly found for today's shift",
        "searched_date" => $today,
        "searched_shift" => $shift
    ]);
    exit;
}

$master_id = $row["master_id"];

/****************************************
 * CHECK IF THIS MASTER HAS BEEN DROPPED
 ****************************************/

$dropCheck = $conn->query("
    SELECT COUNT(*) AS dropped_count
    FROM ConveyorSequence
    WHERE master_id = $master_id AND dropped = 1
");

$dropRow = $dropCheck->fetch_assoc();
$isDropped = ($dropRow["dropped_count"] > 0) ? 1 : 0;

/****************************************
 * RETURN RESPONSE
 ****************************************/

echo json_encode([
    "status" => true,
    "sequence_id" => $row["sequence_id"],
    "master_id" => $master_id,
    "dropped" => $isDropped,

    "master" => [
        "id" => $row["id"],
        "stage_id" => $row["stage_id"],
        "prod_date" => $row["prod_date"],
        "prod_shift" => $row["prod_shift"],

        "axle_serial_no" => $row["axle_serial_no"],
        "axle_spec" => $row["axle_spec"],
        "axle_casing_part_no" => $row["axle_casing_part_no"],
        "brake_part_no_lh" => $row["brake_part_no_lh"],
        "brake_part_no_rh" => $row["brake_part_no_rh"],
        "cwp_diff_carrier_no" => $row["cwp_diff_carrier_no"],
        "axle_qr" => $row["axle_qr"],
        "brake_qr" => $row["brake_qr"],
        "hub_qr" => $row["hub_qr"],
        "abs_qr" => $row["abs_qr"],

        "created_at" => $row["created_at"],
        "dropped" => $isDropped
    ],

    "used_date" => $today,
    "used_shift" => $shift
]);

$stmt->close();
$conn->close();
?>
