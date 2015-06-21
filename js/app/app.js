Ext.namespace('App');

Ext.onReady(function () {
    Ext.Ajax.request({
        url: 'php/index.php?controller=user&action=isAuth',
        failure: function () {
            Ext.Msg.alert('Ошибка на сервере', 'Сервер ответил с ошибкой');
        },
        success: function (response) {
            var result = Ext.util.JSON.decode(response.responseText);
            if (result.success) {
                Ext.Msg.alert('Основное меню', 'Будем выводить здесь меню');
            } else {
                var frmLogin = new App.form.Login({
                    url: 'php/index.php?controller=user&action=login',
                    onSuccessAuth: function () {
                        Ext.Msg.alert('Основное меню', 'Будем выводить здесь меню');
                    },
                    renderTo: Ext.getBody()
                });
                frmLogin.getEl().center();
            }
        }
    });
});
