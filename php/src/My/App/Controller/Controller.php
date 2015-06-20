<?php

namespace My\App\Controller;

class Controller
{
    /**
     * Execute a given command.
     *
     * @param string $action   a command
     * @return array
     */
    public function exec($action)
    {
        if (($action) && (method_exists($this, $action))) {
            return $this->$action();
        }

        return array();
    }
}
