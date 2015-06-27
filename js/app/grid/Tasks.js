Ext.ns('App.grid');

App.grid.Tasks = Ext.extend(Ext.grid.GridPanel, {
    initComponent: function() {
        var tasksStore = new Ext.data.JsonStore({
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
                },
                {
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

        Ext.applyIf(this, {
            store: tasksStore,

            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    width: 120,
                    sortable: true
                },
                columns: [{
                    header: '#',
                    dataIndex: 'id',
                    width: 10
                }, {
                    header: 'Тема',
                    dataIndex: 'subject'
                }, {
                    header: 'Статус',
                    dataIndex: 'status'
                }]
            }),

            viewConfig: {
                forceFit: true
            },

            selModel: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),

            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: tasksStore,
                displayInfo: true,
                loadMask: true,
                frame: true,
                title: 'Список задач'
            })
        });
        App.grid.Tasks.superclass.initComponent.call(this);
    }
});
Ext.reg('app-grid-tasks', App.grid.Tasks);
