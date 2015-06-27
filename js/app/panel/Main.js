Ext.ns('App.panel');
App.panel.Main = Ext.extend(Ext.TabPanel, {
    initComponent: function() {
        var storeUsers = new App.store.Users();
        var storeTasks = new App.store.Tasks();

        Ext.applyIf(this, {
            activeTab: 1,
            border: false,
            tbar: new Ext.Toolbar({
                items: [
                    '->', {
                        xtype: 'app-button-change-profile',
                        afterSuccess: function() {
                            storeUsers.reload();
                        }
                    },
                    '-', {
                        xtype: 'app-button-logout'
                    }
                ]
            }),
            items: [
                {
                    title: 'Пользователи',
                    xtype: 'app-grid-users',
                    store: storeUsers
                }, {
                    title: 'Задачи',
                    xtype: 'app-grid-tasks',
                    store: storeTasks
                }
            ]

        });
        App.panel.Main.superclass.initComponent.call(this);
    }
});
Ext.reg('app-panel-main', App.panel.Main);
