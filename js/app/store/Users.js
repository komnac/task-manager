Ext.ns('App.store');

App.store.Users = Ext.extend(Ext.data.JsonStore, {
    constructor: function(config){
        config = config || {};
        Ext.applyIf(config, {
            root: 'users',
            idProperty: 'id',
            totalProperty: 'totalCount',
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
            autoLoad: {
                params: {
                    start: 0,
                    limit: 20
                }
            },
            remoteSort: true
        });
        App.store.Users.superclass.constructor.call(this, config);
    }
});
