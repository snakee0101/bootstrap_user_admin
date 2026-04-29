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

//modify multiple users status
$result = executeStatement("UPDATE users SET status = {$_GET["status"]} WHERE id IN ({$_GET["users"]});", []);

if($result === false) {
    http_response_code(500);
    echo "{\"status\": false, \"error\": {\"code\": 500, \"message\": \"error executing database query\"}}";
} else {
    echo "{\"status\": true, \"error\": null, \"id\": \"" . $_GET["users"] . "\"}";
}