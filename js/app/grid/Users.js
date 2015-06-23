Ext.ns('App.grid');

App.grid.Users = Ext.extend(Ext.grid.GridPanel, {
    initComponent: function() {
        var usersStore = new Ext.data.JsonStore({
            root: 'users',
            idProperty: 'login',
            url: 'php/index.php?controller=users&action=getList',
            autoLoad: true,
            fields: [
                {name: 'login', type: 'string'},
                {name: 'name', type: 'string' },
                {name: 'email', type: 'string' }
            ],
            softInfo: {
                field: 'name',
                direction: 'DESC'
            },
            remoteSort: true
        });

        Ext.applyIf(this, {
            store: usersStore,

            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    width: 120,
                    sortable: true
                },
                columns: [
                    {header: 'Пользователь', dataIndex: 'login'},
                    {header: 'ФИО', dataIndex: 'name'},
                    {header: 'Почта', dataIndex: 'email'}
                ]
            }),

            viewConfig: {
                forceFit: true
            },

            selModel: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),

            tbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: usersStore,
                displayInfo: true,
                displayMsg: 'Пользователи {0} - {1} из {2}',
                loadMask: true,
                frame: true,
                title: 'Список пользователей',
                items: [
                    '-',
                    {
                        text: 'Создать нового',
                        iconCls: 'add-user',
                        handler: function() {
                            var createUserForm = new App.form.User({
                                title: 'Новый пользователь',
                                renderTo: Ext.getBody(),
                                url: 'php/index.php?controller=user&action=create',
                                OkBtnPressHandler: function (form) {
                                    form.getForm().submit({
                                        success: function() {
                                            usersStore.reload();
                                            Ext.destroy(form);
                                        },
                                        failure: function(frm, action) {
                                            Ext.Msg.alert('Ошибка', action.result.error);
                                        }
                                    });
                                    console.log('Hello Kirill');
                                }
                            });
                            createUserForm.getEl().center();
                        }
                    }
                ]
            })
        });
        App.grid.Users.superclass.initComponent.call(this);
    }
});
Ext.reg('app-grid-users', App.grid.Users);
