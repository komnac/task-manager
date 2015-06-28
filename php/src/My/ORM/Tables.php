<?php

namespace My\ORM;

/**
 * Tables
 *
 * Universal abstract class for work with tables of any entities
 */
abstract class Tables {
    protected $start = 0;
    protected $limit = 0;
    protected $filter = array();
    protected $order  = '';

    /**
     * @var mysqli connection
     */
    protected $db = null;

    /**
     * @var array $fields List of fields in result table
     */
    protected $fields = array();

    /**
     * @var array $filedsAlias List of alias fields (this params has effect only output string)
     */
    protected $fieldsAlias = array();

    /**
     * @var array $tables Lists of tables in SQL
     */
    protected $tables = array();

    /**
     * @var string $relat Relationship SQL string (in WHERE statement)
     */
    protected $relat  = '';

    /** 
     * This method must be init $fields and $tables property
     */
    abstract protected function init();
    
    /**
     * This method must be return Mysqli connection
     */
    abstract protected function getDBO();

    /**
     * You should specify $db property to mysqli connection there
     */
    public function __construct()
    {
        $this->db = $this->getDBO();
        $this->init();
    }

    /**
     * Reset value for default values
     */
    public function reinit()
    {
        $this->init();
    }

    public function getFields()
    {
        $fields = array();

        foreach ($this->fields as $field => $type) {
            if ($name = strrchr($field, '.')) {
                $field = substr($name, 1);
            }

            if ($name = str_replace('`', '', $field)) {
                $fields[] = $name;
            }
        }

        return $fields;
    }

    /**
     * Get a result list
     * 
     * @return array 
     */
    public function loadList($field = null)
    {
        if ((!is_null($field)) && (!$this->getSqlField($field))) {
            return array();
        }

        if (!$sql = $this->_getSql()) {
            return array();
        }

        $res = $this->db->query($sql);

        if (!$res->num_rows) {
            return array();
        }

        if (!is_null($field)) {
            for ($arr = array(); $row = $res->fetch_array(MYSQLI_ASSOC);) {
                $arr[$row[$field]] = $row;
            }
            return $arr;
        } elseif (method_exists('mysqli_result', 'fetch_all')) {
            return $res->fetch_all(MYSQLI_ASSOC);
        } else {
            for ($arr = array(); $row = $res->fetch_array(MYSQLI_ASSOC);) {
                $arr[] = $row;
            }
            return $arr;
        }

    }

    /**
     * Get first row
     *
     * @return array
     */
    public function loadRow()
    {
        if (!$sql = $this->_getSql()) {
            return array();
        }

        $res = $this->db->query($sql);

        if ($res->num_rows) {
            return $res->fetch_array(MYSQLI_ASSOC);
        }

        return array();
    }

    /**
     * Get the result array by one field
     *
     * @param string $field
     * @return array
     */
    public function loadListByField($field)
    {
        if (!$sql = $this->_getSql($field)) {
            return array();
        }

        $res = $this->db->query($sql);

        if ($res->num_rows) {
            return array();
        }

        for ($arr = array(); $row = $res->fetch_row();) {
            $arr[] = $row[0];
        }
        return $arr;
    }

    /**
     * Return total count of result
     * 
     * @return int
     */
    public function getCount()
    {
        $sql = 'SELECT COUNT(*) ';
        $sql.= $this->_getSqlFrom();
        $sql.= $this->_getSqlWhere();

        $res = $this->db->query($sql);

        $row = $res->fetch_row();
        return (int) $row[0];
    }

    /**
     * Set a maximum records
     *
     * @param int $limit 
     */
    public function setLimit($limit)
    {
        $limit = (int) $limit; 
        if ($limit < 0) {
            $limit = 0;
        }

        $this->limit = $limit;
        
        return $this;
    }

    /**
     * Set a start position
     *
     * @param int $start
     */
    public function setStart($start)
    {
        $start = (int) $start; 
        if ($start < 0) {
            $start = 0;
        }

        $this->start = $start;
        
        return $this;
    }
    

    /**
     * Set a field to sort by
     *
     * @param string $field a field to sort by
     *
     * @return null|self Return self or null if couldn't set
     */
    public function sortBy($field, $asc = 'asc')
    {
        $asc = strtolower($asc);
        if (!$field = $this->getSqlField($field)) {
            return null;
        }

        if ($asc != 'desc') {
            $asc = 'asc';
        }

        $this->order = $field . ' ' . $asc;

        return $this;
   }

    /**
     * Add a filter to result Table
     *
     * @param string $field a field to filters by
     * @param mixed $values filter value (or array of values)
     * @param bool $invert invert filter (add NOT)
     *
     * @return self|null self if success, null otherwise
     */
    public function addFilter(/*$field, $value, $invert = false, $group = 'new'*/)
    {
        $vars = $this->_getVarFilter(func_get_args());

        if ($vars['field'] === false || $vars['value'] === false) {
            throw new \BadMethodCallException(Exception::BADARGUMENTS);
        }

        $filter = $this->_getSqlFilter($vars['field'], $vars['value'], $vars['invert']);
        if (!$filter) {
            return null;
        }

        if ($vars['group']) {
            $this->filter[$vars['group']][] = $filter;
        } else {
            $this->filter[][] = $filter;
        }

        return $this;
    }

    protected function _getVarFilter($vars)
    {
        $result = array();

        if (count($vars) == 0) {
            throw new \BadMethodCallException(Exception::BADARGUMENTS);
        }

        if (count($vars) == 1 && is_array($vars[0])) {
            $result['field' ] =
                isset($vars[0]['field' ]) ? $vars[0]['field' ]        : false;
            $result['value' ] =
                isset($vars[0]['value' ]) ? $vars[0]['value' ]        : false;
            $result['invert'] =
                isset($vars[0]['invert']) ? (bool) $vars[0]['invert'] : false;
            $group            =
                isset($vars[0]['group' ]) ? $vars[0]['group']         : false;
        } else {
            $result['field' ] = isset($vars[0]) ? $vars[0]        : false;
            $result['value' ] = isset($vars[1]) ? $vars[1]        : false;
            $result['invert'] = isset($vars[2]) ? (bool) $vars[2] : false;
            $group            = isset($vars[3]) ? $vars[3]        : false;
        }

        if ($group && !is_numeric($group)) {
            $result['group'] = $group;
        } else {
            $result['group'] = false;
        }

        return $result;
    }

    protected function _getSqlFilter($field, $value, $invert = false)
    {
        $sql = '';

        if (($field = $this->getSqlField($field))) {
            $not = $invert ? ' NOT ' : ' ';

            if (is_array($value)) {
                array_walk($value, function(&$v, $k) {
                    $v = $this->db->escape_string($v);
                });
                if ($this->_getFieldType($field) == 'str' ||
                    $this->_getFieldType($field) == 'date') {
                    $sql = $field.$not.'IN ("'.implode('","', $value).'")';
                } else {
                    $sql = $field.$not.'IN (' .implode(','  , $value).')';
                }
            } else {
                if ($this->_getFieldType($field) == 'str') {
                    $value = $this->db->escape_string($value);
                    $sql = $field.$not.' LIKE "'.$value.'"';
                } elseif (preg_match('/^([<>]=?)(.+)$/', $value, $parts)) {
                    if ($this->_getFieldType($field) == 'date') {
                        $value = '"'.(date('Y-m-d H:i:s',
                                           strtotime($parts[2]))).'"';
                    } else {
                        $value = (int) $parts[2];
                    }
                    $sql = $field.' '.$parts[1].' '.$value;
                } else {
                    $op  = $invert ? ' != ' : ' = ';
                    if ($this->_getFieldType($field) == 'date') {
                        $sql = $field.$op.
                            '"'.(date('Y-m-d H:i:s', strtotime($value))).'"';
                    } else {
                        $sql = $field.$op.$value;
                    }
                }
            }
        }

        return $sql;
    }

    /**
     * Remove filter
     *
     * @param mixed $field field or array of arguments
     * @param mixed $values filter value (or array of values)
     * @param bool $invert invert filter (add NOT)
     * @param string $group group of filters
     *
     * @return bool true if success
     */
    public function removeFilter()
    {
        $vars = $this->_getVarFilter(func_get_args());
        if (($vars['field'] === false) && ($vars['group'] === false)) {
            throw new \BadMethodCallException(Exception::BADARGUMENTS);
        }

        $filter = '';
        if ($vars['field'] !== false) {
            if ($vars['value'] !== false) {
                $filter = $this->_getSqlFilter(
                                    $vars['field'],
                                    $vars['value'],
                                    $vars['invert']
                );
            } else {
                $filter = $this->getSqlField($vars['field']);
            }

            if (!$filter) {
                return false;
            }
        }

        $keys = array();
        if ($vars['group']) {
            if (!isset($this->filter[$vars['group']])) {
                return true;
            }

            if (!$filter) {
                unset($this->filter[$vars['group']]);
                return true;
            }

            $keys = array($vars['group']);
        } else {
            $keys = array_keys($this->filter);
        }

        if (!$filter) {
            return false;
        }

        foreach ($keys as $key) {
            foreach($this->filter[$key] as $key_in => $sql) {
                if (strpos($sql, $filter) === 0) {
                    unset($this->filter[$key][$key_in]);
                }
            }

            if (count($this->filter[$key]) === 0) {
                unset($this->filter[$key]);
            }
        }

        return true;
    }

    public function removeAllFilters()
    {
        $this->filter = array();
        return true;
    }

    protected function _clear()
    {
        $this->tables = array();
        $this->fields = array();
        $this->relat  = '';
        $this->filter = array();
        $this->order  = '';
        $this->start  = 0;
        $this->limit  = 0;
    }

    private function getSqlField($field)
    {
        if (array_key_exists($field, $this->fields) || in_array($field, $this->fieldsAlias)) {
            return '`' . str_replace('.', '`.`', $field) . '`';
        }

        foreach ($this->fields as $f => $t) {
            if ($field == substr(strrchr($f, '.'), 1)) {
                return '`' . str_replace('.', '`.`', $f) . '`';
            }
        }

        return false;
    }

    private function _getFieldType($field)
    {
        $field = str_replace('`', '', $field);

        if (isset($this->fields[$field])) {
            return $this->fields[$field];
        }

        foreach ($this->fields as $f => $t) {
            if ($field == substr(strrchr($f, '.'), 1)) {
                return $t;
            }
        }

        return false;
    }

    private function _getSql($fields = '*')
    {
        if ($fields == '*') {
            $fields = array_keys($this->fields);
        }

        if (!is_array($fields)) {
            $fields = explode(',', str_replace(' ', '', $fields));
        }

        foreach ($fields as &$field) {
            $alias = (array_key_exists($field, $this->fieldsAlias)) ? ' as ' . $this->fieldsAlias[$field] : '';
            $field = $this->getSqlField($field) . $alias;
            if (empty($field)) {
                return false;
            }
        }

        $sql  = 'SELECT DISTINCT ' . (implode(', ', $fields));
        $sql .= $this->_getSqlFrom();
        $sql .= $this->_getSqlWhere();
        $sql .= $this->_getSqlOrder();
        $sql .= $this->_getSqlLimit();

        return $sql;
    }

    private function _getSqlFrom()
    {
        return ' FROM ' . (implode(',', $this->tables));
    }

    private function _getSqlWhere() {
        $filter = $this->filter;
        $where  = '';

        if ($filter) {
            foreach ($filter as &$group) {
                $group = '(' . implode(' OR ', $group) . ')';
            }

            $where .= ' WHERE (' . implode(' AND ', $filter) . ') ';
        }

        if ($this->relat) {
            $where .= ($where ? ' AND ' : ' WHERE ') . '(' . $this->relat . ')';
        }

        return $where;
    }

    private function _getSqlOrder() {
        if ($this->order) {
            return ' ORDER BY ' . $this->order;
        }

        return '';
    }

    private function _getSqlLimit() {
        if (($this->limit) || ($this->start)) {
            return ' LIMIT ' . $this->start . ',' . $this->limit;
        }

        return '';
    }
}
