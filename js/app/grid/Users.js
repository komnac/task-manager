Ext.ns('App.grid');

App.grid.Users = Ext.extend(Ext.grid.GridPanel, {
    initComponent: function() {
        Ext.applyIf(this, {
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

            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: this.store,
                displayInfo: true,
                loadMask: true,
                frame: true,
                title: 'Список пользователей',
                items: [
                    '-',
                    {
                        text: 'Создать нового',
                        iconCls: 'add-user',
                        border: true,
                        handler: function() {
                            var gridStore = this.ownerCt.ownerCt.store;
                            var createUserForm = new App.form.User({
                                title: 'Новый пользователь',
                                renderTo: Ext.getBody(),
                                url: 'php/index.php?controller=user&action=create',
                                updateStore: gridStore,
                                OkBtnPressHandler: function (form) {
                                    form.getForm().submit({
                                        success: function() {
                                            form.updateStore.reload();
                                            Ext.destroy(form);
                                        },
                                        failure: function(frm, action) {
                                            if (action.result.error) {
                                                Ext.Msg.alert('Ошибка', action.result.error);
                                            } else {
                                                Ext.Msg.alert('Ошибка', 'Неизвестная ошибка от сервера');
                                            }
                                        }
                                    });
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
