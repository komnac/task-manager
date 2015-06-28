<?php

namespace My\App\Model;

class Task extends Table
{
    const STATUS_NEW = '';
    const STATUS_WORK = '';
    const STATUS_REPORT = '';
    const STATUS_DONE = '';

    protected function getTableName()
    {
        return '`tm_tasks`';
    }

    protected function getFieldsKey()
    {
        return ['id'];
    }

    protected function getFieldsEditable()
    {
        return [ 'description', 'report', 'finish_time', 'status', 'create_time' ];
    }

    protected function getFieldsRequired()
    {
        return [ 'subject', 'owner_id', 'executor_id' ];
    }
}
