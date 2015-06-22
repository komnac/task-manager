<?php

namespace My\App\Controller;

use My\App\Registry as Registry;
use My\App\Model\User as UserModel;

class User extends Controller {
    public function isAuth() {
        $global = Registry::getInstance();
        try {
             return array(
                'success' => true,
                'login'   => $global->user->login,
                'name'   => $global->user->name
            );
        } catch (\Exception $e) {
            return array(
                'success' => false,
                'login'   => '',
                'name'    => ''
            );
        }
    }

    public function login() {
        $this->logoff();
        $global = Registry::getInstance();

        $user     = $global->getVar('login', '');
        $password = $global->getVar('password', '');

        try {
            $user = new UserModel($user);
            if (!$user->auth($password)) {
                throw new Exception(Exception::IVALID_LOGIN);
            }
            $global->user = $user;

            $data = array(
                'success' => true,
                'login'   => $user->login,
                'name'    => $user->name
            );
        } catch (\Exception $e) {
            $data =  array(
                'success' => false,
                'login'   => ''
            );
        }

        return $data;
    }

    public function logoff() {
        $global = Registry::getInstance();
        unset($global->user);

        return array(
            'success' => true
        );
    }
}
