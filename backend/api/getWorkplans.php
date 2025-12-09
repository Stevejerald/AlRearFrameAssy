<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

date_default_timezone_set("Asia/Kolkata");

include "../config/db.php";

/******************************************
 * FETCH ALL WORKPLANS
 ******************************************/
$sql = "
    SELECT 
        id,
        date,
        shift,
        count,
        created_at
    FROM workplan
    ORDER BY date DESC, shift ASC
";

$res = $conn->query($sql);

$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = [
        "id"         => intval($row["id"]),
        "date"       => $row["date"],
        "shift"      => $row["shift"],
        "count"      => intval($row["count"]),
        "created_at" => $row["created_at"]
    ];
}

echo json_encode([
    "status" => true,
    "data" => $data
]);

$conn->close();
?>
