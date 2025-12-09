<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

date_default_timezone_set("Asia/Kolkata");

include "../config/db.php";

$input = json_decode(file_get_contents("php://input"), true);

// ------------------------
// VALIDATION
// ------------------------
if (!isset($input['date']) || !isset($input['shift']) || !isset($input['count'])) {
    echo json_encode([
        "status" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

$date  = $input['date'];
$shift = $input['shift'];
$count = intval($input['count']);

// ------------------------
// CHECK IF ALREADY EXISTS (date + shift unique)
// ------------------------
$chk = $conn->prepare("SELECT id FROM workplan WHERE date = ? AND shift = ?");
$chk->bind_param("ss", $date, $shift);
$chk->execute();
$chk_res = $chk->get_result();

if ($chk_res->num_rows > 0) {
    echo json_encode([
        "status" => false,
        "message" => "Workplan already exists for this date & shift"
    ]);
    exit;
}

// ------------------------
// INSERT INTO TABLE
// ------------------------
$sql = $conn->prepare("
    INSERT INTO workplan (date, shift, count, created_at)
    VALUES (?, ?, ?, NOW())
");
$sql->bind_param("ssi", $date, $shift, $count);

if ($sql->execute()) {
    echo json_encode([
        "status" => true,
        "message" => "Workplan created successfully"
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Database error: " . $conn->error
    ]);
}

$conn->close();
?>
