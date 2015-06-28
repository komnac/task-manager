Ext.ns('App.button');

App.button.Logout = Ext.extend(Ext.Button, {
    initComponent: function() {
        Ext.applyIf(this, {
            text: 'Выйти',
            iconCls: 'exit',
            handler: function () {
                Ext.Ajax.request({
                    url: 'php/index.php?controller=user&action=logoff',
                    failure: function () {
                        Ext.Msg.alert('Ошибка на сервере', 'Сервер ответил с ошибкой');
                    },
                    success: function () {
                        window.location.reload();
                    }
                });
            }
        });

        App.button.Logout.superclass.initComponent.call(this);
    }
});
Ext.reg('app-button-logout', App.button.Logout);
