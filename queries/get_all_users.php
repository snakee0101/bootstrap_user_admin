<?php

include '../database/connection.php';

echo json_encode(executeQuery('SELECT * FROM `users`;'));