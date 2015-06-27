Ext.ns('App.button');

App.button.ChangeProfile = Ext.extend(Ext.Button, {
    initComponent: function () {
        Ext.applyIf(this, {
            text: 'Обновить информацию о себе',
            afterSuccess: function() {},
            handler: function () {
                var afterSuccessFn = this.afterSuccess;
                var userForm = new App.form.User({
                    title: 'Редактировать',
                    url: 'php/index.php?controller=user&action=update',
                    renderTo: Ext.getBody(),
                    OkBtnPressHandler: function (form) {
                        form.getForm().submit({
                            success: function () {
                                afterSuccessFn();
                                Ext.destroy(form);
                            },
                            failure: function (frm, action) {
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
        });

        App.button.ChangeProfile.superclass.initComponent.call(this);
    }
});
Ext.reg('app-button-change-profile', App.button.ChangeProfile);
