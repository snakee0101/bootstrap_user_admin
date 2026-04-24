<?php

include __DIR__ . '/connection.php';

executeStatement(
    "INSERT INTO `users` (`first_name`, `last_name`, `status`, `role`) VALUES (?, ?, ?, ?)",
    ["John", "Doe", 1, "admin"]
);

executeStatement(
    "INSERT INTO `users` (`first_name`, `last_name`, `status`, `role`) VALUES (?, ?, ?, ?)",
    ["Jane", "Smith", 0, "user"]
);

executeStatement(
    "INSERT INTO `users` (`first_name`, `last_name`, `status`, `role`) VALUES (?, ?, ?, ?)",
    ["Alice", "Johnson", 1, "user"]
);

executeStatement(
    "INSERT INTO `users` (`first_name`, `last_name`, `status`, `role`) VALUES (?, ?, ?, ?)",
    ["Bob", "Brown", 0, "user"]
);

executeStatement(
    "INSERT INTO `users` (`first_name`, `last_name`, `status`, `role`) VALUES (?, ?, ?, ?)",
    ["Charlie", "Davis", 1, "admin"]
);