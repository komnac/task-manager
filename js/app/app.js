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
                Ext.Msg.alert('Аутентификация', 'Нужна аутентификация');
            }
        }
    });
});