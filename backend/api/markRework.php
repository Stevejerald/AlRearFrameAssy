<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

date_default_timezone_set("Asia/Kolkata");

include "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input["master_id"])) {
    echo json_encode(["status" => false, "message" => "master_id required"]);
    exit;
}

$master_id = intval($input["master_id"]);
$reason = "Assembly Head Sent to Rework";
$emp_id = "Assembly Head";  // Or use logged-in admin ID

/******************************************
 * 1. TRY TO FETCH LATEST STAGE FOR LOGGING
 ******************************************/
$sql1 = "SELECT id AS sequence_id, stage_id 
         FROM ConveyorSequence 
         WHERE master_id = ?
         ORDER BY id DESC 
         LIMIT 1";

$stmt1 = $conn->prepare($sql1);
$stmt1->bind_param("i", $master_id);
$stmt1->execute();
$res1 = $stmt1->get_result();
$stmt1->close();

if ($row = $res1->fetch_assoc()) {
    // Conveyor record exists
    $sequence_id = $row["sequence_id"];
    $stage_id = $row["stage_id"];
} else {
    // ❗ No sequence exists — admin triggered BEFORE any stage started
    $sequence_id = 0;
    $stage_id = "Assembly Head";   // Put ADMIN as stage
}

/******************************************
 * 2. GET PROD DATE + SHIFT
 ******************************************/
$sql2 = "SELECT prod_date, prod_shift 
         FROM rearframeassymaster 
         WHERE id = ?";

$stmt2 = $conn->prepare($sql2);
$stmt2->bind_param("i", $master_id);
$stmt2->execute();
$res2 = $stmt2->get_result();
$m = $res2->fetch_assoc();
$stmt2->close();

/******************************************
 * 3. INSERT DROP LOG ENTRY (ADMIN ACTION)
 ******************************************/
$sql3 = "INSERT INTO drop_log 
        (master_id, sequence_id, stage_id, emp_id, prod_date, prod_shift, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt3 = $conn->prepare($sql3);
$stmt3->bind_param(
    "iisssss",
    $master_id,
    $sequence_id,
    $stage_id,
    $emp_id,
    $m["prod_date"],
    $m["prod_shift"],
    $reason
);

$stmt3->execute();
$stmt3->close();

/******************************************
 * 4. MARK MASTER AS REWORK
 ******************************************/
$sql4 = "UPDATE rearframeassymaster 
         SET rework_status = 'PENDING'
         WHERE id = ?";

$stmt4 = $conn->prepare($sql4);
$stmt4->bind_param("i", $master_id);
$stmt4->execute();
$stmt4->close();

$conn->close();

/******************************************
 * RESPONSE
 ******************************************/
echo json_encode([
    "status" => true,
    "message" => "Assembly sent to REWORK by Assembly Head and logged successfully",
    "master_id" => $master_id,
    "sequence_id" => $sequence_id,
    "stage_id" => $stage_id
]);
?>
