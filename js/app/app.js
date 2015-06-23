Ext.apply(Ext.form.VTypes, {
    password : function(val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    passwordText : 'Пароли не совпадают'
});

Ext.ns('App');

Ext.onReady(function () {
    Ext.QuickTips.init();

    var mainAppliction = function() {
        new Ext.Viewport({
            layout: 'fit',
            items: new App.panel.Main({
                renderTo: Ext.getBody()
            })
        });
    }

    Ext.Ajax.request({
        url: 'php/index.php?controller=user&action=isAuth',
        failure: function () {
            Ext.Msg.alert('Ошибка на сервере', 'Сервер ответил с ошибкой');
        },
        success: function (response) {
            var auth = Ext.util.JSON.decode(response.responseText);
            if (!auth.success) {
                var frmLogin = new App.form.Login({
                    url: 'php/?controller=user&action=login',
                    successAuthHandler: mainAppliction,
                    renderTo: Ext.getBody()
                });
                frmLogin.getEl().center();
            } else {
                mainAppliction()
            }
        }
    });
});
