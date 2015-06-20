<?php

require_once __DIR__ . '/vendor/autoload.php';

define('APPDEBUG', '1');
if (APPDEBUG) {
    ini_set('display_errors',1);
    error_reporting(E_ALL);
}

try {
    session_start();

    $configs = glob(__DIR__ . DIRECTORY_SEPARATOR . 'conf' . DIRECTORY_SEPARATOR . '*.php');
    foreach ($configs as $config) {
        require_once $config;
    }

    My\Database\Connection::setUpConfig($DBPARAMS);
    $registry = My\App\Registry::getInstance();

    $data = [];
} catch (Exception $e) {
    $data = [
        'success' => false,
        'error'   => $e->getMessage()
    ];
}

header('Content-type: application/json');
echo json_encode($data);
