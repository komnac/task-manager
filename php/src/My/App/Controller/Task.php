<?php

namespace My\App\Controller;

use My\App\Registry;
use My\App\Model\Task as TaskModel;

class Task extends RequireAuthController
{
    public function create() {
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
}
