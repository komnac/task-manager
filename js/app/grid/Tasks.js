Ext.ns('App.grid');

App.grid.Tasks = Ext.extend(Ext.grid.GridPanel, {
    initComponent: function() {
        Ext.applyIf(this, {
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
                }, {
                    header: 'Создана',
                    dataIndex: 'create_time',
                    xtype: 'datecolumn',
                    format: 'd.m.Y H:i'
                }, {
                    header: 'Поставил',
                    dataIndex: 'owner_name',
                    renderer: function(value, metatdata, record) {
                        return record.get('owner_name') + ' (' + record.get('owner_login') + ')';
                    }
                }, {
                    header: 'Исполнитель',
                    dataIndex: 'executor_name',
                    renderer: function(value, metatdata, record) {
                        return record.get('executor_name') + ' (' + record.get('executor_login') + ')';
                    }
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
                store: this.store,
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
