<?php

namespace My\App\Controller;

class Exception extends \Exception
{
    const IVALID_LOGIN = 'Неверное имя пользователя или пароль';
    const AUTH_REQUIRED = 'Для выполнения этого действия требуется аутентифифироваться';
    const PW_MISMATCH = 'Пароли не совпадают';
}
