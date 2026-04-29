<?php

include '../database/connection.php';

//validation - user ids must be positive integers separated by comma
if (preg_match('/^\d+(,\d+)*$/', $_GET["users"]) == false) {
    echo json_encode([
        "status" => false,
        "error" => [
            "code" => 422,
            "message" => "User id list contains invalid numbers."
        ]
    ]);

    exit;
}

//Delete multiple users
$result = executeStatement("DELETE FROM users WHERE id IN ({$_GET["users"]});", []);

if ($result === false) {
    http_response_code(500);

    echo json_encode([
        "status" => false,
        "error" => [
            "code" => 500,
            "message" => "Error executing database query."
        ]
    ]);
} else {
    echo json_encode([
        "status" => true,
        "error" => null,
        "id" => $_GET["users"]
    ]);
}