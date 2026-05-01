<?php

include '../database/connection.php';

$errors = [];

//Validation
if($_POST['first_name'] == "") {
    $errors[] = ["field" => "first_name", "message" => "First Name is required."];
}

if($_POST['last_name'] == "") {
    $errors[] = ["field" => "last_name", "message" => "Last Name is required."];
}

if(in_array($_POST['status'], ["0", "1"]) === false) {
    $errors[] = ["field" => "status", "message" => "Selected status doesn't exist."];
}

if(in_array($_POST['role'], ["user", "admin"]) === false) {
    $errors[] = ["field" => "role", "message" => "Selected role doesn't exist"];
}

if(empty($errors) === false) {
    echo json_encode([
        "status" => false,
        "error" => [
            "code" => 422,
            "message" => $errors
        ],
    ]);

    return;
}

//update and return a record
$user_id = (int)$_POST['user_record_id'];

executeStatement(
    "UPDATE users 
     SET `first_name` = ?, 
         `last_name` = ?, 
         `status` = ?, 
         `role` = ?
     WHERE `id` = ?;",
     [
        $_POST['first_name'],
        $_POST['last_name'],
        (int)$_POST['status'],
        $_POST['role'],
        $user_id
    ]
);

echo json_encode([
    "status" => true,
    "error_code" => 0,
    "error" => null,
    "user" => [
        "id" => $user_id,
        "first_name" => $_POST['first_name'],
        "last_name" => $_POST['last_name'],
        "status" => $_POST['status'],
        "role" => $_POST['role']
    ]
]);