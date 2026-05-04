<?php

include '../database/connection.php';

//validation - user ids must be positive integers separated by comma
$user_id_list_str = implode(",", $_POST["users"]);

if (preg_match('/^\d+(,\d+)*$/', $user_id_list_str) == false) {
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
$result = executeStatement("DELETE FROM users WHERE id IN ({$user_id_list_str});", []);

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
        "id" => count($_POST["users"]) == 1 ? $_POST["users"][0] : $_POST["users"]
    ]);
}