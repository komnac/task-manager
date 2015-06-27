Ext.ns('App.store');

App.store.Tasks = Ext.extend(Ext.data.JsonStore, {
    constructor: function(config){
        config = config || {};
        Ext.applyIf(config, {
            root: 'tasks',
            idProperty: 'id',
            url: 'php/index.php?controller=tasks&action=getList',
            autoLoad: true,
            fields: [
                {
                    name: 'id',
                    type: 'int'
                }, {
                    name: 'owner_id',
                    type: 'int'
                }, {
                    name: 'owner_name',
                    type: 'string'
                }, {
                    name: 'owner_login',
                    type: 'string'
                }, {
                    name: 'executor_id',
                    type: 'int'
                }, {
                    name: 'executor_name',
                    type: 'string'
                }, {
                    name: 'executor_login',
                    type: 'string'
                }, {
                    name: 'create_time',
                    mapping: 'create_time',
                    type: 'date',
                    dateFormat: 'Y-m-d H:i:s'
                }, {
                    name: 'finish_time',
                    mapping: 'finish_time',
                    type: 'date',
                    dateFormat: 'Y-m-d H:i:s'
                }, {
                    name: 'subject',
                    type: 'string'
                }, {
                    name: 'status',
                    type: 'string'
                }
            ],
            softInfo: {
                field: 'id',
                direction: 'DESC'
            },
            remoteSort: true
        });
        App.store.Tasks.superclass.constructor.call(this, config);
    }
});