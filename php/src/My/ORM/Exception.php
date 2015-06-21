<?php

namespace My\ORM;

class Exception extends \Exception
{
    const BADARGUMENTS  = 'Некорректно заданны аргументы';
    const OBJNOTEXISTS  = 'Загружаемый объект не существует';
    const NOLOADOBJ     = 'Объект не загружен (попытка обратиться к полю)';
    const NOREQPROP     = 'Не указаны требуемые поля';
    const WRONGPROP     = 'Не верно задано свойство';
    const UNKNOWNPROP   = 'Неизвестное поле';
    const FULLSHIT      = 'Очень странная ошибка';
    const NOWRITABLE    = 'Невозможно указать неизменяемое поле';
}
