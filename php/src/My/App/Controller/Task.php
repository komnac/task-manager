<?php

namespace My\App\Controller;

use My\App\Registry;
use My\App\Model\Task as TaskModel;

class Task extends RequireAuthController
{
    public function create()
    {
        $global = Registry::getInstance();

        $subject = $global->getVar('subject', '');
        $executor = $global->getVar('executor_id', 0);
        $description = $global->getVar('description', '');

        if (!($subject && $executor)) {
            throw new Exception('Не верно заполнены поля формы');
        }

        try {
            $task = new TaskModel();
            $task->create([
                'subject' => $subject,
                'executor_id' => $executor,
                'owner_id' => $global->user->id,
                'description' => $description
            ]);
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => 'Не удалось создать задачу.'
                            . 'Ошибка: ' . $e->getMessage()
            ];
        }

        return [
            'success' => true
        ];
    }

    public function doInProgress()
    {
        $global = Registry::getInstance();

        $task = new TaskModel($global->getVar('task_id', 0));
        if ($task->executor_id != $global->user->id) {
            throw new Exception('Статус может менять только исполнитель');
        }

        if ($task::STATUS_NEW != $task->status) {
            throw new Exception('В работу брать можно только новые задачи');
        }

        $task->status = $task::STATUS_WORK;

        return [
            'success' => true
        ];
    }

    public function doReport()
    {
        $global = Registry::getInstance();

        $task = new TaskModel($global->getVar('task_id', 0, 'int'));
        if ($task->executor_id != $global->user->id) {
            throw new Exception('Статус может менять только исполнитель');
        }

        if ($task::STATUS_WORK != $task->status) {
            throw new Exception('Сделать отчет можно только по рабочей задаче');
        }

        $task->status = $task::STATUS_REPORT;
        $task->report = $global->getVar('report', 'Выполнена');

        return [
            'success' => true
        ];
    }

    public function doFinish()
    {
        $global = Registry::getInstance();

        $task = new TaskModel($global->getVar('task_id', 0, 'int'));
        if ($task->owner_id != $global->user->id) {
            throw new Exception('Закрыть задачу может только владелец');
        }

        if ($task::STATUS_DONE == $task->status) {
            throw new Exception('Задача уже закрыта');
        }

        $task->status = $task::STATUS_DONE;

        return [
            'success' => true
        ];
    }
}
