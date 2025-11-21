<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include "../config/db.php";

$master_id = $_GET['master_id'] ?? null;

if (!$master_id) {
    echo json_encode(["status" => false, "message" => "master_id required"]);
    exit;
}

$sql = "
SELECT audio
FROM RearFrameAssyStageTasks
WHERE master_id = ?
  AND audio IS NOT NULL
  AND LENGTH(audio) > 20
ORDER BY id ASC
LIMIT 1
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $master_id);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
    echo json_encode([
        "status" => true,
        "audio" => $row["audio"]
    ]);
} else {
    echo json_encode(["status" => false, "message" => "No audio found"]);
}
