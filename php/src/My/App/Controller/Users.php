<?php

namespace My\App\Controller;

use My\App\Registry;
use My\App\Model\Users as UsersModel;

class Users extends RequireAuthController
{
    public function getList() {
        $global = Registry::getInstance();

        $users = new UsersModel();
        $users->sortBy($global->getVar('sort', ''), $global->getVar('dir', 'asc'));
        $users->setLimit($global->getVar('limit', 0));
        $users->setStart($global->getVar('start', 0));
        if ($search = $global->getVar('query', '')) {
            $search = '%' . $search . '%';
            $users->addFilter('login', $search, false, 'search_login');
            $users->addFilter('name', $search, false, 'search_login');
        }

        return [
            'totalCount' => $users->getCount(),
            'users'      => $users->loadList()
        ];
    }
}
