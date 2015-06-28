<?php

namespace My\App\Controller;

use My\App\Registry;
use My\App\Model\Tasks as TasksModel;

class Tasks extends RequireAuthController
{
    public function getList() {
        $global = Registry::getInstance();

        $tasks = new TasksModel();
        $tasks->addFilter('executor_id', $global->user->id, false, 'owner_or_executor');
        $tasks->addFilter('owner_id', $global->user->id, false, 'owner_or_executor');
        $tasks->sortBy($global->getVar('sort', ''), $global->getVar('dir', 'asc'));
        $tasks->setLimit($global->getVar('limit', 0));
        $tasks->setStart($global->getVar('start', 0));

        return [
            'totalCount' => $tasks->getCount(),
            'tasks'      => $tasks->loadList()
        ];
    }
}
