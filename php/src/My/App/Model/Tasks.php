<?php

namespace My\App\Model;

class Tasks extends Tables
{
    protected function init()
    {
        $this->_clear();
        $this->tables = ['tm_tasks', 'tm_users as executor', 'tm_users as owner'];
        $this->fields = [
            'tm_tasks.id' => 'int',
            'owner_id' => 'int',
            'owner.name' => 'str',
            'owner.login' => 'str',
            'executor_id' => 'int',
            'executor.name' => 'str',
            'executor.login' => 'str',
            'create_time' => 'date',
            'finish_time' => 'date',
            'subject' => 'str',
            'description' => 'str',
            'report' => 'str',
            'status' => 'str'
        ];

        $this->fieldsAlias = [
            'owner.name' => 'owner_name',
            'owner.login' => 'owner_login',
            'executor.name' => 'executor_name',
            'executor.login' => 'executor_login'
        ];

        $this->relat = 'tm_tasks.owner_id = owner.id AND tm_tasks.executor_id = executor.id';
    }
}
