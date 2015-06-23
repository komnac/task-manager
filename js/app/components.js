Ext.ns('App.panel');
App.panel.Main = Ext.extend(Ext.TabPanel, {
    initComponent: function() {
        var usersGrid = new App.grid.Users();

        Ext.applyIf(this, {
            activeTab: 0,
            border: false,
            items: [
                {
                    title: 'Пользователи',
                    xtype: 'app-grid-users'
                }, {
                    title: 'Задачи',
                    html: '<h3>Здесь будем выводить задачи</h3>'
                }
            ]

        });
        App.panel.Main.superclass.initComponent.call(this);
    }
});
Ext.reg('app-panel-main', App.panel.Main);

Ext.ns('App.form');
App.form.Login = Ext.extend(Ext.FormPanel, {
    initComponent: function() {
        Ext.applyIf(this, {
            title: 'Аутентификация',
            width: 260,
            height: 120,
            frame: true,
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Пользователь',
                name: 'login',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: 'Пароль',
                name: 'password',
                inputType: 'password',
                allowBlank: false
            }],
            successAuthHandler: function() {
                Ext.Msg.alert('Успех', 'Успешно авторизованы');
            },
            buttons: [{
                text: 'Войти',
                handler: function (btn, event) {
                    var frm = btn.ownerCt.ownerCt;
                    frm.getForm().submit({
                        success: function () {
                            frm.hide();
                            frm.successAuthHandler();
                            Ext.destroy(frm);
                        },
                        failure: function () {
                            Ext.Msg.show({
                                title: 'Ошибка',
                                msg: 'Не верно указаны логин или пароль!',
                                icon: Ext.Msg.ERROR,
                                buttons: Ext.Msg.OK
                            });
                        },
                        waitTitle: 'Подождите',
                        waitMsg: 'Загружаю...'
                    })
                }
            }]
        });
        App.form.Login.superclass.initComponent.call(this);
    }
});
Ext.reg('app-form-login', App.form.Login);

App.form.User = Ext.extend(Ext.FormPanel, {
    initComponent: function() {
        Ext.applyIf(this, {
            title: 'Пользователь',
            width: 260,
            height: 200,
            frame: true,
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Пользователь',
                name: 'login',
                anchor: '99%',
                allowBlank: false
            },{
                xtype: 'textfield',
                fieldLabel: 'ФИО',
                name: 'name',
                anchor: '99%'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Пароль',
                name: 'password',
                id: 'password',
                inputType: 'password',
                anchor: '99%',
                allowBlank: false
            }, {
                xtype: 'textfield',
                fieldLabel: 'Еще раз пароль',
                name: 'replyPassword',
                vtype: 'password',
                inputType: 'password',
                initialPassField: 'password',
                anchor: '99%',
                allowBland: false
            }, {
                xtype: 'textfield',
                fieldLabel: 'Почта',
                name: 'email',
                vtype: 'email',
                anchor: '99%'
            }],
            OkBtnPressHandler: function (form) {
                 Ext.destroy(form)
            },
            buttons: [{
                text: 'ОК',
                handler: function (btn, event) {
                    var frm = btn.ownerCt.ownerCt;
                    if (!frm.getForm().isValid()) {
                        Ext.Msg.alert('Ошибка заполнения', 'Форма заполнена не верно');
                        return;
                    }

                    frm.OkBtnPressHandler(frm);
                }
            }, {
                text: 'Отмена',
                handler: function (btn, event) {
                    var frm = btn.ownerCt.ownerCt;
                    Ext.destroy(frm);
                }
            }]
        });
        App.form.User.superclass.initComponent.call(this);
    }
});
Ext.reg('app-form-user', App.form.User);

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
