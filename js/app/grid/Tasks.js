Ext.ns('App.grid');

App.grid.Tasks = Ext.extend(Ext.grid.GridPanel, {
    initComponent: function() {
        Ext.applyIf(this, {
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    width: 120,
                    sortable: true
                },
                columns: [{
                    header: '#',
                    dataIndex: 'id',
                    width: 10
                }, {
                    header: 'Тема',
                    dataIndex: 'subject'
                }, {
                    header: 'Статус',
                    dataIndex: 'status'
                }, {
                    header: 'Создана',
                    dataIndex: 'create_time',
                    xtype: 'datecolumn',
                    format: 'd.m.Y H:i'
                }, {
                    header: 'Последнее изменение',
                    dataIndex: 'update_time',
                    xtype: 'datecolumn',
                    format: 'd.m.Y H:i'
                }, {
                    header: 'Поставил',
                    dataIndex: 'owner_name',
                    renderer: function(value, metatdata, record) {
                        return record.get('owner_name') + ' (' + record.get('owner_login') + ')';
                    }
                }, {
                    header: 'Исполнитель',
                    dataIndex: 'executor_name',
                    renderer: function(value, metatdata, record) {
                        return record.get('executor_name') + ' (' + record.get('executor_login') + ')';
                    }
                }]
            }),

            viewConfig: {
                forceFit: true
            },

            selModel: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),

            tbar: {
                items: [{
                    text: 'Новая',
                    iconCls: 'add-task',
                    handler: function(btn) {
                        var storeTasks = btn.ownerCt.ownerCt.store;
                        var createTaskForm = new App.form.CreateTask({
                            title: 'Новая задача',
                            url: 'php/index.php?controller=task&action=create',
                            renderTo: Ext.getBody(),
                            successCreateHandler: function () {
                                storeTasks.reload();
                            }
                        });
                        createTaskForm.getEl().center();
                    }
                },
                '-', {
                    text: 'В работу',
                    id: 'task-inprogress-btn',
                    iconCls: 'play-task',
                    disabled: true,
                    handler: function(btn) {
                        var storeTasks = btn.ownerCt.ownerCt.store;
                        var taskId = btn.ownerCt.ownerCt.selModel.getSelected().get('id');
                        Ext.Ajax.request({
                            url: 'php/index.php?controller=task&action=doInProgress&task_id=' + taskId,
                            failure: function () {
                                Ext.Msg.alert('Ошибка на сервере', 'Сервер ответил с ошибкой');
                            },
                            success: function (response) {
                                console.log(response);
                                var result = Ext.util.JSON.decode(response.responseText);
                                if (!result.success) {
                                    Ext.Msg.alert('Ошибка смены статуса', 'Ошибка: ' + result.error);
                                    return false;
                                }

                                storeTasks.reload();
                                btn.setDisabled(true);
                                btn.ownerCt.reportBtn.setDisabled(false);
                            }
                        });
                    }
                },
                '-', {
                    text: 'Отчет',
                    id: 'task-report-btn',
                    ref: 'reportBtn',
                    iconCls: 'report-task',
                    disabled: true,
                    handler: function (btn) {
                        var reportBtn = btn;
                        var storeTasks = reportBtn.ownerCt.ownerCt.store;
                        var taskId = reportBtn.ownerCt.ownerCt.selModel.getSelected().get('id');
                        var reportForm = new Ext.FormPanel({
                            title: 'Отчет',
                            url: 'php/index.php?controller=task&action=doReport',
                            width: 650,
                            height: 400,
                            renderTo: Ext.getBody(),
                            frame: true,
                            labelAlign: 'top',
                            items: [{
                                xtype: 'hidden',
                                value: taskId,
                                name: 'task_id'
                            }, {
                                xtype: 'htmleditor',
                                name: 'report',
                                anchor: '99%'
                            }],
                            buttons: [{
                                text: 'Отправить',
                                handler: function (btn) {
                                    var frm = btn.ownerCt.ownerCt;
                                    frm.getForm().submit({
                                        success: function () {
                                            reportBtn.setDisabled(true);
                                            storeTasks.reload();
                                            Ext.destroy(frm);
                                        },
                                        failure: function () {
                                            Ext.Msg.show({
                                                title: 'Ошибка',
                                                msg: '!',
                                                icon: Ext.Msg.ERROR,
                                                buttons: Ext.Msg.OK
                                            });
                                        },
                                        waitTitle: 'Подождите',
                                        waitMsg: 'Загружаю...'
                                    });
                                }
                            }, {
                                text: 'Отмена',
                                handler: function (btn) {
                                    Ext.destroy(btn.ownerCt.ownerCt);
                                }
                            }]
                        });
                        reportForm.getEl().center();
                    }
                },
                '-', {
                    text: 'Завершить',
                    id: 'task-finish-btn',
                    iconCls: 'finish-task',
                    disabled: true,
                        handler: function(btn) {
                            var storeTasks = btn.ownerCt.ownerCt.store;
                            var taskId = btn.ownerCt.ownerCt.selModel.getSelected().get('id');
                            Ext.Ajax.request({
                                url: 'php/index.php?controller=task&action=doFinish&task_id=' + taskId,
                                failure: function () {
                                    Ext.Msg.alert('Ошибка на сервере', 'Сервер ответил с ошибкой');
                                },
                                success: function (response) {
                                    var result = Ext.util.JSON.decode(response.responseText);
                                    if (!result.success) {
                                        Ext.Msg.alert('Ошибка смены статуса', 'Ошибка: ' + result.error);
                                        return false;
                                    }

                                    storeTasks.reload();
                                    btn.setDisabled(true);
                                    btn.ownerCt.reportBtn.setDisabled(false);
                                }
                            });
                        }
                }]
            },

            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: this.store,
                displayInfo: true,
                loadMask: true,
                frame: true
            })
        });
        App.grid.Tasks.superclass.initComponent.call(this);
    }
});
Ext.reg('app-grid-tasks', App.grid.Tasks);
