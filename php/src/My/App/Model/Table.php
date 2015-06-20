<?php

namespace My\App\Model;

use My\Database\Connection as DBConnection;
use My\ORM\Table as OrmTable;

abstract class Table extends OrmTable
{
    protected function getDBO()
    {
        return DBConnection::getInstance();
    }
}
