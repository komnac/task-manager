Ext.namespace('App.form');

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
            'onSuccessAuth': function() {
                Ext.Msg.alert('Успех', 'Успешно авторизованы');
            },
            buttons: [{
                text: 'Войти',
                handler: function (btn, event) {
                    var frm = btn.ownerCt.ownerCt;
                    frm.getForm().submit({
                        success: function () {
                            frm.hide();
                            frm.onSuccessAuth();
                            Ext.destroy(frm);
                        },
                        failure: function () {
                            Ext.Msg.show({
                                title: 'Ошибка',
                                msg: 'Не верно указаны имя пользователя или пароль!',
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
Ext.reg('appformlogin', App.form.Login);
