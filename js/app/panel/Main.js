Ext.ns('App.panel');
App.panel.Main = Ext.extend(Ext.TabPanel, {
    initComponent: function() {
        var usersGrid = new App.grid.Users();

        Ext.applyIf(this, {
            activeTab: 0,
            border: false,
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
