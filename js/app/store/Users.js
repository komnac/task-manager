Ext.ns('App.store');

App.store.Users = Ext.extend(Ext.data.JsonStore, {
    constructor: function(config){
        config = config || {};
        Ext.applyIf(config, {
            root: 'users',
            idProperty: 'id',
            url: 'php/index.php?controller=users&action=getList',
            autoLoad: true,
            fields: [
                {name: 'id',    type: 'int'},
                {name: 'login', type: 'string'},
                {name: 'name',  type: 'string' },
                {name: 'email', type: 'string' }
            ],
            softInfo: {
                field: 'name',
                direction: 'DESC'
            },
            remoteSort: true
        });
        App.store.Users.superclass.constructor.call(this, config);
    }
});
