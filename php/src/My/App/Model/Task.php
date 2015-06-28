<?php

namespace My\App\Model;

class Task extends Table
{
    const STATUS_NEW = 'Создана';
    const STATUS_WORK = 'В работе';
    const STATUS_REPORT = 'Отчет';
    const STATUS_DONE = 'Завершена';

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
        return [ 'description', 'report', 'update_time', 'status', 'create_time' ];
    }

    protected function getFieldsRequired()
    {
        return [ 'subject', 'owner_id', 'executor_id' ];
    }

    public function __set($param, $value)
    {
        if ($param == 'status') {
             switch($value) {
                 case self::STATUS_NEW:
                 case self::STATUS_WORK:
                 case self::STATUS_REPORT:
                     if ($this->status === self::STATUS_DONE) {
                         throw new \Exception("Нельзя изменить статус у уже закрытой задачи");
                     }
                 case self::STATUS_DONE:
                     break;
                 default:
                     throw new \InvalidArgumentException("Неверно заданное значение статуса");
             }
        }

        return parent::__set($param, $value);
    }
}
