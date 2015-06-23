Ext.ns('App.toolbar');

App.toolbar.MainMenu = Ext.extend(Ext.Toolbar, {
    initComponent: function() {
        Ext.applyIf(this, {
            autoWidth: true,
            items: [{
                'text': 'Обновить информацию о себе',
                handler: function () {
                    var userForm = new App.form.User({
                        title: 'Редактировать',
                        url: 'php/index.php?controller=user&action=update',
                        renderTo: Ext.getBody(),
                        OkBtnPressHandler: function (form) {
                            form.getForm().submit({
                                success: function() {
                                    console.log('HI KIRILL');
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
                    userForm.getForm().findField('password').allowBlank = true;
                    userForm.getForm().findField('login').setReadOnly(true);
                    userForm.load({
                        url: 'php/index.php?controller=user&action=getInfo',
                        failure: function () {
                            Ext.Msg.alert('Ошибка', 'Ошибка связи с сервером');
                        }
                    });

                    userForm.getEl().center();
                }
            },
            '-',
            {
                text: 'Выйти',
                handler: function () {
                    Ext.Ajax.request({
                        url: 'php/index.php?controller=user&action=logoff',
                        failure: function () {
                            Ext.Msg.alert('Ошибка на сервере', 'Сервер ответил с ошибкой');
                        },
                        success: function (response) {
                            window.location.reload();
                        }
                    });
                }
            }]
        });
        App.toolbar.MainMenu.superclass.initComponent.call(this);
    }
});
Ext.reg('app-main-menu-toolbar', App.toolbar.MainMenu);
