<?php

include '../database/connection.php';

//Validation
$errors = [];
if($_POST['first_name'] == "") {
    $errors["first_name"] = "First Name is required";
}

if($_POST['last_name'] == "") {
    $errors["last_name"] = "Last Name is required";
}

if(in_array($_POST['status'], ["0", "1"]) === false) {
    $errors["status"] = "Selected status doesn't exist";
}

if(in_array($_POST['role'], ["user", "admin"]) === false) {
    $errors["role"] = "Selected role doesn't exist";
}

if(empty($errors) === false) {
    echo json_encode([
        "status" => false,
        "error_code" => 422,
        "errors" => $errors,
        "user" => ""
    ]);

    return;
}

//create and return a record
echo json_encode([
    "status" => true,
    "error_code" => 0,
    "errors" => null,
    "user" => []
]);