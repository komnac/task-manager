<?php

namespace My\Database;

/**
 * Mysqli with changed error behaviour on a query
 *
 * May be it's seems like workaround, but this simplify my life.
 */

class MysqliExtended extends \mysqli
{
    /**
     * {@inheritdoc}
     */
    public function query($query, $resultmode = MYSQLI_STORE_RESULT)
    {
        if (!$result = parent::query($query, $resultmode)) {
            throw new Exception(
                Exception::BADQUERY
                . '[' . $query . ']: ' . $this->error
            );
        }

        return $result;
    }
}
