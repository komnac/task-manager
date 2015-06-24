Ext.ns('App.panel');
App.panel.Main = Ext.extend(Ext.TabPanel, {
    initComponent: function() {
        Ext.applyIf(this, {
            activeTab: 0,
            border: false,
            tbar: new Ext.Toolbar({
                items: [
                    '->', {
                        xtype: 'app-button-change-profile'
                    },
                    '-', {
                        xtype: 'app-button-logout'
                    }
                ]
            }),
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
