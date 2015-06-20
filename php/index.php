<?php

require_once __DIR__ . '/vendor/autoload.php';

define('APPDEBUG', '1');

try {
    session_start();

    if (APPDEBUG) {
        ini_set('display_errors',1);
        error_reporting(E_ALL);
    }

    $registry = My\App\Registry::getInstance();

} catch (Exception $e) {
    $data = [
        'success' => false,
        'error'   => $e->getMessage()
    ];
}

header('Content-type: application/json');
echo json_encode($data);
