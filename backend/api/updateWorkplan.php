<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

date_default_timezone_set("Asia/Kolkata");
include "../config/db.php";

// Read Input JSON
$input = json_decode(file_get_contents("php://input"), true);

$id    = $input["id"] ?? null;
$date  = $input["date"] ?? null;
$shift = $input["shift"] ?? null;
$count = $input["count"] ?? null;

/******************************************
 * VALIDATION
 ******************************************/
if (!$id || !$date || !$shift || !$count) {
    echo json_encode([
        "status" => false,
        "message" => "All fields (id, date, shift, count) are required."
    ]);
    exit;
}

/******************************************
 * CHECK DUPLICATE DATE + SHIFT (EXCEPT CURRENT)
 ******************************************/
$sql_check = "
    SELECT id FROM workplan 
    WHERE date = ? AND shift = ? AND id != ?
    LIMIT 1
";

$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("ssi", $date, $shift, $id);
$stmt_check->execute();
$res_check = $stmt_check->get_result();

if ($res_check->num_rows > 0) {
    echo json_encode([
        "status" => false,
        "message" => "A workplan already exists for this date and shift."
    ]);
    exit;
}

/******************************************
 * UPDATE WORKPLAN (FIXED)
 ******************************************/
$sql_update = "
    UPDATE workplan 
    SET date = ?, shift = ?, count = ?
    WHERE id = ?
";

$stmt = $conn->prepare($sql_update);
$stmt->bind_param("ssii", $date, $shift, $count, $id);

if ($stmt->execute()) {
    echo json_encode([
        "status" => true,
        "message" => "Workplan updated successfully."
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Failed to update workplan: " . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?>
