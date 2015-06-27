<?php

require_once __DIR__ . '/vendor/autoload.php';

use My\Database\Connection as DBConnection;
use My\App\Registry as Registry;
use My\App\Controller\User as UserController;
use My\App\Controller\Users as UsersController;
use My\App\Controller\Tasks as TasksController;

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

    DBConnection::setUpConfig($DBPARAMS);

    $global = Registry::getInstance();
    switch ($global->getVar('controller', '')) {
        case 'user':
            $action = new UserController();
            break;
        case 'users':
            $action = new UsersController();
            break;
        case 'tasks':
            $action = new TasksController();
            break;
        default:
            die('');
    }

    $data = $action->exec($global->getVar('action', ''));
} catch (Exception $e) {
    $data = [
        'success' => false,
        'error'   => $e->getMessage()
    ];
}

header('Content-type: application/json');
echo json_encode($data);
