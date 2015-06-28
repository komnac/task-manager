Ext.ns('App.panel');
App.panel.Main = Ext.extend(Ext.TabPanel, {
    initComponent: function() {
        var storeUsers = new App.store.Users({
            proxy: new Ext.data.HttpProxy({
                url: 'php/index.php?controller=users&action=getList'
            })
        });
        var storeTasks = new App.store.Tasks({
            proxy: new Ext.data.HttpProxy({
                url: 'php/index.php?controller=tasks&action=getList'
            })
        });

        Ext.applyIf(this, {
            activeTab: 1,
            border: false,
            region: 'center',
            margins:'0 5 5 0',
            tbar: {
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
            },
            items: [
                {
                    title: 'Пользователи',
                    xtype: 'app-grid-users',
                    store: storeUsers
                }, {
                    title: 'Задачи',
                    layout: 'border',
                    items: [{
                        region: 'center',
                        xtype: 'app-grid-tasks',
                        store: storeTasks,
                        sm: new Ext.grid.RowSelectionModel({
                            singleSelect:true,
                            listeners: {
                                selectionchange: function(sel){
                                    var rec = sel.getSelected();
                                    if (!rec) {
                                        return;
                                    }

                                    var text = '<h1>' + rec.get('subject') + '</h1><br />'
                                    + rec.get('description') + '<br /><hr />';
                                    if (rec.get('report')) {
                                        text += '<h2>Отчет</h2>' + rec.get('report');
                                    }

                                    Ext.getCmp('task-description').body.update(text);
                                }
                            }
                        })
                    }, new Ext.Panel({
                        id: 'task-description',
                        region: 'south',
                        collapsible: true,
                        title: 'Описание задания',
                        height: 300,
                        split: true,
                        bodyStyle: 'padding: 10px; font-family: Arial; font-size: 12px;'
                    })]
                }
            ]

        });
        App.panel.Main.superclass.initComponent.call(this);
    }
});
Ext.reg('app-panel-main', App.panel.Main);
