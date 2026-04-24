<?php

function executeQuery($query, $query_parameters = [])
{
    $connection_settings = require __DIR__ . '/connection_settings.php';

    $pdo = new PDO("mysql:host=$connection_settings[host];dbname=$connection_settings[database]", $connection_settings["username"], $connection_settings["password"]);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare($query);
    $stmt->execute($query_parameters);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function executeStatement($query, $query_parameters = [])
{
    $connection_settings = require __DIR__ . '/connection_settings.php';

    $pdo = new PDO("mysql:host=$connection_settings[host];dbname=$connection_settings[database]", $connection_settings["username"], $connection_settings["password"]);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare($query);
    return $stmt->execute($query_parameters);
}