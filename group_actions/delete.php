<?php

include '../database/connection.php';

//TODO: Add validation

$result = executeStatement("DELETE FROM users WHERE id IN ({$_GET["users"]});", []);

if($result === false) {
    http_response_code(500);
    echo "{\"status\": false, \"error\": {\"code\": 500, \"message\": \"error executing database query\"}}";
} else {
    echo "{\"status\": true, \"error\": null, \"id\": \"" . $_GET["users"] . "\"}";
}