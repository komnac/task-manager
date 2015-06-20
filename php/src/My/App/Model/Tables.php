<?php

namespace My\App\Model;

use My\Database\Connection as DBConnection;
use My\ORM\Tables as OrmTables;

abstract class Tables extends OrmTables
{
    protected function getDBO()
    {
        return DBConnection::getInstance();
    }
}
