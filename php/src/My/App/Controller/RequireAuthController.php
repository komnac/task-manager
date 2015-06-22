<?php

namespace My\App\Controller;

class RequireAuthController extends Controller{
    public function exec($action)
    {
        $user = new User();
        if ($user->isAuth()["success"]) {
            return parent::exec($action);
        }

        throw new Exception(Exception::AUTH_REQUIRED);
    }
}
