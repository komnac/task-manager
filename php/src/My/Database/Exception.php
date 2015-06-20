<?php

namespace My\Database;

class Exception extends \Exception
{
    const BADQUERY  = "Ошибка выполнения запроса";
    const NOCONNECT = "Ошибка подключения к БД";
}
