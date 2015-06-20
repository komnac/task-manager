<?php

namespace My\App;

class Registry
{
    protected static $instance = null;

    public function __set($name, $value)
    {
        $_SESSION[$name] = serialize($value);
    }

    public function __get($name)
    {
        if (isset($_SESSION[$name])) {
            return unserialize($_SESSION[$name]);
        }

        if (!isset($_REQUEST[$name])) {
            throw new Exception(Exception::UNKNOWN_PARAM . $name);
        }

        return $_REQUEST[$name];
    }

    public function __isset($name)
    {
        return ((isset($_REQUEST[$name])) || (isset($_SESSION[$name])));
    }

    public function __unset($name)
    {
        if (isset($_SESSION[$name])) {
            unset($_SESSION[$name]);
        }
    }

    public static function getInstance()
    {
        if (is_null(self::$instance)) {
            self::$instance = new Registry();
        }
        return self::$instance;
    }

    public static function getVar($name, $default = '', $type = 'raw')
    {
        if (!isset($_REQUEST[$name])) {
            return $default;
        }

        $val = $_REQUEST[$name];
        switch ($type) {
            case 'raw':
                return $val;
                break;
            case 'int':
                return (int) $val;
                break;
            case 'bool':
                return (bool) $val;
                break;
            default:
                $type = addcslashes($type, '/\'');
                if (preg_match('/' . $type . '/', $val, $match)) {
                    return $match[0];
                } else {
                    return $default;
                }
        }
    }

    private function __clone() {}
    private function __wakeup() {}
    private function __construct() {}
}
