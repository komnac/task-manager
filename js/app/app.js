Ext.ns('App');

Ext.onReady(function () {
    Ext.QuickTips.init();

    var user = null;

    var mainAppliction = function(response) {
        new Ext.Viewport({
            layout: 'fit',
            items: [{
                xtype: 'app-panel-main',
                userId: response.id
            }]
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
                mainAppliction(auth)
            }
        }
    });
});
