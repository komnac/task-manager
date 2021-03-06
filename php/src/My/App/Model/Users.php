<?php

namespace My\App\Model;

class Users extends Tables
{
    protected function init()
    {
        $this->_clear();
        $this->tables = ['tm_users'];
        $this->fields = [
            'id'     => 'int',
            'login'  => 'str',
            'name'   => 'str',
            'email'  => 'str'
        ];
    }
}
