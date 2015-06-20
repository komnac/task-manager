<?php

namespace My\ORM;

abstract class Table
{
    protected $db     = null;
    protected $values = array();
    
    /**
     * Return a Database connection 
     *
     * @return object mysqli
     */
    abstract protected function getDBO();
    
    /**
     * Must return table name
     *
     * @return string
     */ 
    abstract protected function getTableName();
    
    /**
     * Must return an array of fields list which used as keys
     *  {used for load() and delete()}
     *
     *  @return array
     */
    abstract protected function getFieldsKey();
    
    /**
     * Must return an editable fields list
     *
     * @return array
     */
    abstract protected function getFieldsEditable();

    /**
     * Must return a fields list of required for create
     *
     * @return array
     */
    abstract protected function getFieldsRequired();
    
    public function __construct($fvalues = null)
    {
        $this->db = $this->getDBO();
        $this->init();
        
        if ((!is_null($fvalues)) && (!$this->load($fvalues))) {
            $this->throwException(Exception::OBJNOTEXISTS, $fvalues);
        }
    }
    
    /**
     * Create a new record in Database
     *  Must be specified required fields
     *
     *  @param mixed Array field => value for create record
     *  
     *  @return object self (created object)
     */
    public function create($fvalues)
    {
        $rfields = $this->getFieldsRequired();

        if (!is_array($fvalues)) {
            if (count($rfields) == 1) {
                $fvalues = array($rfields[0] => $fvalues);
            } else {
                $this->throwException(Exception::NOREQPROP, $fvalues);
            }
        }
        
        $sql = array();
        $key = array();
        foreach($rfields as $field) {
            if ((!isset($fvalues[$field])) || ($fvalues[$field] == '')) {
                $this->throwException(Exception::NOREQPROP, $fvalues);
            }
            
            $sql[] = '`' . $field . '` = "' . $this->db->escape_string($fvalues[$field]) . '"';
            $key[$field] = $fvalues[$field];
            unset($fvalues[$field]);
        }
        
        $sql = 'INSERT INTO ' . $this->getTableName() . ' SET '.
               implode(',', $sql);
        $this->db->query($sql);

        // Мы создали новую запись. Теперь пытаемся загрузить ее
        //  Возможны 2 случая
        //   1) Мы уже вставили запись с главным ключом (и мы его знаем)
        //   2) Мы получили ключ от insert_id
        // Чтобы согласовать эти и другие данные, загрузим созданные объект
        $fkey = array_diff($this->getFieldsKey(), array_keys($key));
        if (count($fkey) > 1) {
            $this->throwException(Exception::FULLSHIT, $fkey);
        } elseif (count($fkey) == 1) {
            $key[array_shift($fkey)] = $this->db->insert_id;
        }

        if (!$this->load($key)) {
            $this->throwException(Exception::FULLSHIT, $key);
        }
        
        foreach ($fvalues as $field => $value) {
            $this->__set($field, $value);
        }
        
        return $this;
    }
    
    
    /**
     * Load a record to object
     *
     * @param mixed Array Array (field => value ...) with keys fields
     *
     * @return bool true if success
     */
    public function load($fvalues)
    {
        $rfields = $this->getFieldsKey();

        if (!is_array($fvalues)) {
            if (count($rfields) == 1) {
                $fvalues = array($rfields[0] => $fvalues);
            } else {
                $this->throwException(Exception::NOREQPROP, $fvalues);
            }
        }
        
        $sql = array();
        foreach ($rfields as $field) {
            if ((!isset($fvalues[$field])) || ($fvalues[$field] == '')) {
                $this->throwException(Exception::NOREQPROP, $fvalues);
            }
            
            $sql[] = '`' . $field . '` = "' . $this->db->escape_string($fvalues[$field]) . '"';
        }
        
        $sql = 'SELECT * FROM ' . $this->getTableName() . ' WHERE ' . implode(',', $sql);
        $res = $this->db->query($sql);
        
        if ((!$res) || ($res->num_rows < 1)) {
            return false;
        }
        
        $row = $res->fetch_assoc();
        foreach($row as $field => $value) {
            if (!$this->isField($field)) {
                $this->throwException(Exception::UNKNOWNPROP, $field);
            }
            
            $this->values[$field] = $value;
        }
        
        return $this;
    }
    
    /**
     * Remove a current record from Database and clear object
     *  Object must be set
     */
    public function delete()
    {
        if (!$where = $this->getKeyExpression()) {
            $this->throwException(Exception::NOLOADOBJ);
        }
        
        $sql = 'DELETE FROM ' . $this->getTableName() . ' WHERE ' . $where;
        $this->db->query($sql);
        
        $this->init();
        
        return $this;
    }
    
    public function __set($field, $value)
    {
        if (!$where = $this->getKeyExpression()) {
            $this->throwException(Exception::NOLOADOBJ, $field);
        }
        
        if (!$this->isField($field)) {
            $this->throwException(Exception::UNKNOWNPROP, $field);
        }

        if ($this->values[$field] == $value) {
            return true;
        }
        
        if (!in_array($field, $this->getFieldsEditable())) {
            $this->throwException(Exception::NOWRITABLE, $field);
        }
        
        $value = $this->db->escape_string($value);
        $sql   = 'UPDATE ' . $this->getTableName()
                    . ' SET `' . $field . '` = "' . $value . '"'
                    . ' WHERE ' . $where;
        $this->db->query($sql);
        
        $this->values[$field] = $value;
    }
    
    public function __get($field)
    {
        if (!$this->getKeyExpression()) {
            $this->throwException(Exception::NOLOADOBJ, $field);
        }

        if (!$this->isField($field)) {
            $this->throwException(Exception::UNKNOWNPROP, $field);
        }

        return $this->values[$field];
    }

    protected function getKeyExpression()
    {
        $fkey = $this->getFieldsKey();
        $sql = array();
        foreach ($fkey as $field) {
            if ((!isset($this->values[$field])) ||
                ($this->values[$field] == '')) {
                return false;
            }

            $sql[] = '`' . $field . '` = "' . $this->values[$field] . '"';
        }

        return implode(',', $sql);
    }

    protected function init()
    {
        $this->values = array();
    }

    protected function isField($field)
    {
        return in_array(
                    $field,
                    array_unique(
                        array_merge(
                            $this->getFieldsEditable(),
                            $this->getFieldsKey(),
                            $this->getFieldsRequired()
                         )
                    )
               );
    }

    protected function throwException($message, $params = '')
    {
        throw new Exception($message . ' [' . get_class($this) . '] => {' . $params . '}');
    }
}
