<?php

namespace My\App\Controller;

use My\App\Registry as Registry;
use My\App\Model\User as UserModel;
use My\Database\Exception as DatabaseException;

class User extends Controller {
    public function isAuth()
    {
        $global = Registry::getInstance();
        try {
            return [
                'success' => true,
                'login'   => $global->user->login,
                'id'   => $global->user->id
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'login'   => '',
                'id'    => ''
            ];
        }
    }

    public function login()
    {
        $this->logoff();
        $global = Registry::getInstance();

        $login    = $global->getVar('login', '');
        $password = $global->getVar('password', '');

        try {
            $user = new UserModel();
            if (!$user->find(['login' => $login ]) || !$user->auth($password)) {
                throw new Exception(Exception::IVALID_LOGIN);
            }
            $global->user = $user;

            $data = [
                'success' => true,
                'login'   => $user->login,
                'id'    => $user->id
            ];
        } catch (\Exception $e) {
            $data =  [
                'success' => false,
                'login'   => ''
            ];
        }

        return $data;
    }

    public function update()
    {
        if (!$this->isAuth()) {
            throw new Exception(Exception::AUTH_REQUIRED);
        }

        $global = Registry::getInstance();

        if ($global->user->login !== $global->getVar('login', '')) {
            throw new Exception('Нельзя обновлять чужой профиль');
        }
        $password = $global->getVar('password', '');
        $replyPassword = $global->getVar('replyPassword', '');

        if ($password) {
            if ($password !== $replyPassword) {
                throw new Exception(Exception::PW_MISMATCH);
            }
            $global->user->password = $password;
        }
        $global->user->name = $global->getVar('name', '');
        $global->user->email = $global->getVar('email', '');

        return [
            'success' => true
        ];
    }


    public function getInfo()
    {
        if (!$this->isAuth()) {
            throw new Exception(Exception::AUTH_REQUIRED);
        }

        $user = Registry::getInstance()->user;
        return [
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'login' => $user->login,
                'email' => $user->email
            ]
        ];
    }

    public function logoff()
    {
        $global = Registry::getInstance();
        unset($global->user);

        return [
            'success' => true
        ];
    }

    public function create()
    {
        if (!$this->isAuth()) {
            throw new Exception(Exception::AUTH_REQUIRED);
        }

        $global = Registry::getInstance();
        $login = $global->getVar('login', '');
        $name = $global->getVar('name', '');
        $password = $global->getVar('password', '');
        $replyPassword = $global->getVar('replyPassword', '');
        $email = $global->getVar('email', '');

        if (empty($login) || empty($password)) {
            throw new Exception('Не все обязательные поля заданы');
        }

        if ($password !== $replyPassword) {
            throw new Exception('Пароли не совпадают');
        }

        $user = new UserModel();
        try {
            $user->create([
                'login' => $login,
                'password' => $password,
                'name' => $name,
                'email' => $email
            ]);
        } catch (DatabaseException $e) {
            return [
                'success' => false,
                'error' => 'Такой пользователь существует'
            ];
        }


        return [
            'success' => true
        ];
    }
}
