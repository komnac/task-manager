Ext.ns('App.form');

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
