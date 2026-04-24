<?php

function executeQuery($query, $query_parameters)
{
    $connection_settings = require __DIR__ . '/connection_settings.php';

    $pdo = new PDO("mysql:host=$connection_settings[host];dbname=$connection_settings[database]", $connection_settings["username"], $connection_settings["password"]);

    $stmt = $pdo->prepare($query);
    $result = $stmt->execute($query_parameters);

    return $result->fetchAll(PDO::FETCH_ASSOC);
}

function executeStatement($query, $query_parameters)
{
    $connection_settings = require __DIR__ . '/connection_settings.php';

    $pdo = new PDO("mysql:host=$connection_settings[host];dbname=$connection_settings[database]", $connection_settings["username"], $connection_settings["password"]);

    $stmt = $pdo->prepare($query);
    return $stmt->execute($query_parameters);
}