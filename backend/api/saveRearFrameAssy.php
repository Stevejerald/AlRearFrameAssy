<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // CORS preflight
}

include "../config/db.php"; 

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode([
        "status" => false,
        "message" => "Invalid JSON data"
    ]);
    exit;
}

$stageId            = $input['stageId']            ?? null;
$dateShift          = $input['dateShift']          ?? '';
$axleSerialNo       = $input['axleSerialNo']       ?? '';
$axleSpec           = $input['axleSpec']           ?? '';
$axleCasingPartNo   = $input['axleCasingPartNo']   ?? '';
$brakePartNoLH      = $input['brakePartNoLH']      ?? '';
$brakePartNoRH      = $input['brakePartNoRH']      ?? '';
$cwpDiffNo          = $input['cwpDiffNo']          ?? '';
$axleQR             = $input['axleQR']             ?? '';
$brakeQR            = $input['brakeQR']            ?? '';
$hubQR              = $input['hubQR']              ?? '';
$absQR              = $input['absQR']              ?? '';

// Basic validation
if ($stageId === null) {
    echo json_encode([
        "status" => false,
        "message" => "stageId is required"
    ]);
    exit;
}

$sql = "INSERT INTO RearFrameAssyMaster
        (stage_id, date_shift, axle_serial_no, axle_spec, axle_casing_part_no,
         brake_part_no_lh, brake_part_no_rh, cwp_diff_carrier_no,
         axle_qr, brake_qr, hub_qr, abs_qr)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "message" => "Prepare failed: " . $conn->error
    ]);
    exit;
}

$stmt->bind_param(
    "isssssssssss",
    $stageId,
    $dateShift,
    $axleSerialNo,
    $axleSpec,
    $axleCasingPartNo,
    $brakePartNoLH,
    $brakePartNoRH,
    $cwpDiffNo,
    $axleQR,
    $brakeQR,
    $hubQR,
    $absQR
);

if ($stmt->execute()) {
    echo json_encode([
        "status" => true,
        "message" => "Data saved successfully"
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Insert failed: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
