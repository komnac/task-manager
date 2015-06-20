<?php

namespace My\Database;

/**
 * Singleton realisation for database connection.
 */
class Connection
{

    private static $instance = null;
    private static $conf = [];

    private function __clone() {}
    private function __wakeup() {}
    private function __construct() {}

    /**
     * @return MysqliExtended
     *
     * @throws Exception        When can not connect
     */
    private static function createDbo() {
        $db = new MysqliExtended(
            self::$conf['dbhost'],
            self::$conf['dbuser'],
            self::$conf['dbpw'],
            self::$conf['dbname']
        );

        if ($db->connect_error) {
            throw new Exception(
                Exception::NOCONNECT
                . ': ' . $db->connect_error
            );
        }

        $db->query('SET NAMES  "' . self::$conf['dbencod'] . '"');

        return $db;
    }

    /**
     * Return an instance of Database connection by specified configuration.
     *   If connection established, and $conf not specified return previous connection.
     *
     * @return MysqliExtended
     *
     * @throws Exception    When can't connect
     */
    public static function getInstance()
    {

        if ((self::$instance === null) || (!self::$instance->ping())) {
            if (empty(self::$conf)) {
                self::setUpConfig([]);
            }

            self::$instance = self::createDbo();
        }

        return self::$instance;
    }

    /**
     * @param array $conf       Connection params
     *                          Default: [
     *                                      'dbhost'  => 'localhost',
     *                                      'dbuser'  => 'root',
     *                                      'dbpw'    => '',
     *                                      'dbname'  => 'tm',
     *                                      'dbencod' => 'UTF-8'
     *                          ]
     */
    public static function setUpConfig($conf)
    {
        self::$conf['dbhost']  = isset($conf['dbhost']) ? $conf['dbhost'] : 'localhost';
        self::$conf['dbuser']  = isset($conf['dbuser']) ? $conf['dbuser'] : 'root';
        self::$conf['dbpw']    = isset($conf['dbpw']) ? $conf['dbpw'] : '';
        self::$conf['dbname']  = isset($conf['dbname']) ? $conf['dbname'] : 'tm';
        self::$conf['dbencod'] = isset($conf['dbencod']) ? $conf['dbencod'] : 'utf8';
    }
}
