<?php

namespace My\App\Model;

class User extends Table
{
    protected function getTableName()
    {
        return '`tm_users`';
    }
    
    protected function getFieldsKey()
    {
        return array('login');
    }
    
    protected function getFieldsEditable()
    {
        return array('name', 'email', 'password', 'is_admin');
    }

    protected function getFieldsRequired()
    {
        return $this->getFieldsKey();
    }

    public function __set($param, $value)
    {
        if ($param == 'password') {
            $value = $this->getPassword($value);
        }
                
        return parent::__set($param, $value);
    }
    
    public function auth($password)
    {
        return $this->getPassword($password) == $this->__get('password');
    }
    
    private function getPassword($value)
    {
        return md5(md5($value));
    }
    
}
