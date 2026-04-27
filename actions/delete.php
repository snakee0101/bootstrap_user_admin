<?php

include '../database/connection.php';

$result = executeQuery("SELECT COUNT(*) FROM users WHERE id = ?;", [$_GET["user_id"]]);
$count = $result[0]["COUNT(*)"];

if($count === 0) {
    http_response_code(404);
    echo "{status: false, error:{code: 100, message: \"not found user\"}}";
} else {
    executeQuery("DELETE FROM users WHERE id = ?;", [$_GET["user_id"]]);

    echo "{status: true, error:null, id: " . $_GET["user_id"] . "}";
}