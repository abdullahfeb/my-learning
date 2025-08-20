<?php
require 'config.php';

header('Content-Type: application/json');

// Get loss by stage
$lossByStage = $pdo->query("
    SELECT stage, SUM(quantity) as total
    FROM loss_records
    WHERE recorded_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY stage
")->fetchAll(PDO::FETCH_ASSOC);

// Get loss by meat type
$lossByType = $pdo->query("
    SELECT mt.name, SUM(lr.quantity) as total
    FROM loss_records lr
    JOIN meat_types mt ON lr.meat_type_id = mt.id
    WHERE lr.recorded_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY mt.name
")->fetchAll(PDO::FETCH_ASSOC);

// Return as JSON

echo json_encode([
    'lossByStage' => $lossByStage,
    'lossByType' => $lossByType
]);
