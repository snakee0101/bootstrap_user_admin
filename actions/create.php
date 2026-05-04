<?php

include '../database/connection.php';

$errors = [];

//Unique validation
$result = executeQuery("SELECT id FROM users WHERE first_name = ? AND last_name = ?", [$_POST['first_name'], $_POST['last_name']]);
if ($result[0]["id"] != null) {
    $errors[] = ["code" => 101, "field" => "first_name", "message" => "User with such credentials already exists."];
    $errors[] = ["code" => 101, "field" => "last_name", "message" => "User with such credentials already exists."];
}

//Validation
if($_POST['first_name'] == "") {
    $errors[] = ["code" => 102, "field" => "first_name", "message" => "First Name is required."];
}

if($_POST['last_name'] == "") {
    $errors[] = ["code" => 102, "field" => "last_name", "message" => "Last Name is required."];
}

if(in_array($_POST['status'], ["0", "1"]) === false) {
    $errors[] = ["code" => 103, "field" => "status", "message" => "Selected status doesn't exist."];
}

if(in_array($_POST['role'], ["user", "admin"]) === false) {
    $errors[] = ["code" => 103, "field" => "role", "message" => "Selected role doesn't exist"];
}

if(count($errors) == 1) {
    echo json_encode([
        "status" => false,
        "error" => $errors[0],
    ]);

    return;
}

if(count($errors) > 1) {
    echo json_encode([
        "status" => false,
        "errors" => $errors,
    ]);

    return;
}

//TODO: Maybe make a UNIQUE constraint on the database level

//create and return a record
executeStatement("INSERT INTO users(`first_name`, `last_name`, `status`, `role`) VALUES (?, ?, ?, ?);", $query_parameters = [$_POST['first_name'], $_POST['last_name'], (int)$_POST['status'], $_POST['role']]);
$result = executeQuery("SELECT id FROM users WHERE first_name = ? AND last_name = ? AND status = ? AND role = ?", [$_POST['first_name'], $_POST['last_name'], (int)$_POST['status'], $_POST['role']]);

echo json_encode([
    "status" => true,
    "error_code" => 0,
    "error" => null,
    "user" => [
        "id" => $result[0]["id"],
        "first_name" => $_POST['first_name'],
        "last_name" => $_POST['last_name'],
        "status" => $_POST['status'],
        "role" => $_POST['role']
    ]
]);