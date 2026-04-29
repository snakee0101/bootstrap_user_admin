<?php

include '../database/connection.php';

$result = executeQuery("SELECT COUNT(*) FROM users WHERE id = ?;", [$_GET["user_id"]]);
$count = $result[0]["COUNT(*)"];

if ($count === 0) {
    http_response_code(404);

    echo json_encode([
        "status" => false,
        "error" => [
            "code" => 100,
            "message" => "Not found user."
        ]
    ]);
} else {
    executeQuery("DELETE FROM users WHERE id = ?;", [$_GET["user_id"]]);

    echo json_encode([
        "status" => true,
        "error" => null,
        "id" => $_GET["user_id"]
    ]);
}