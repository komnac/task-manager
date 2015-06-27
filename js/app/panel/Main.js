Ext.ns('App.panel');
App.panel.Main = Ext.extend(Ext.TabPanel, {
    initComponent: function() {
        Ext.applyIf(this, {
            activeTab: 1,
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
                    xtype: 'app-grid-tasks'
                }
            ]

        });
        App.panel.Main.superclass.initComponent.call(this);
    }
});
Ext.reg('app-panel-main', App.panel.Main);
