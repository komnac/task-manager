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

            tbar: {
                items: [{
                    text: 'Новая',
                    handler: function() {
                        var createTaskForm = new App.form.CreateTask({
                            title: 'Новая задача',
                            url: 'php/index.php?controller=task&action=create',
                            renderTo: Ext.getBody(),
                            successCreateHandler: function () {
                                console.log('Created');
                            }
                        });
                        createTaskForm.getEl().center();
                    }
                }]
            },

            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: this.store,
                displayInfo: true,
                loadMask: true,
                frame: true
            })
        });
        App.grid.Tasks.superclass.initComponent.call(this);
    }
});
Ext.reg('app-grid-tasks', App.grid.Tasks);
