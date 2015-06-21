Ext.namespace('App.panel');

App.panel.Main = Ext.extend(Ext.TabPanel, {
    initComponent: function() {

        Ext.applyIf(this, {
            activeTab: 1,
            border: false,
            items: [{
                title: 'Пользователи',
                html: '<h3>Здесь будем выводить пользователей</h3>'
            }, {
                title: 'Задачи',
                html: '<h3>Здесь будем выводить задачи</h3>'
            }]

        });
        App.panel.Main.superclass.initComponent.call(this);
    }
});
Ext.reg('app-panel-main', App.panel.Main);
