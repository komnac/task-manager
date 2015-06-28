Ext.ns('App.form');

App.form.CreateTask = Ext.extend(Ext.FormPanel, {
    initComponent: function() {
        Ext.applyIf(this, {
            title: 'Создание задачи',
            width: 700,
            height: 420,
            frame: true,
            successCreateHandler: function() {},
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Имя',
                name: 'subject',
                anchor: '99%',
                allowBlank: false
            }, {
                xtype: 'combo',
                fieldLabel: 'Исполнитель',
                anchor: '99%',
                hiddenName: 'executor_id',
                allowBlank: false,

                mode: 'remote',
                queryDelay: 200,
                pageSize: 10,
                minChars: 1,

                hideTrigger: true,
                selectOnFocus: true,
                enableKeyEvents: true,
                typeAhead: false,
                triggerAction: 'all',
                forceSelection: true,
                listEmptyText: 'Не найдены',

                valueField: 'id',
                displayField: 'value',
                store: {
                    url: 'php/index.php?controller=users&action=getList',
                    reader: new Ext.data.JsonReader({
                        root: 'users',
                        totalProperty: 'totalCount',
                        fields: ['id', 'login', 'name', {
                            name: 'value',
                            convert: function (v, rec) {
                                return rec.name + ' (' + rec.login + ')';
                            }
                        }]
                    })
                }
            }, {
                xtype: 'htmleditor',
                fieldLabel: 'Описание',
                name: 'description',
                anchor: '99%'
            }],
            buttons: [{
                text: 'Создать',
                handler: function (btn) {
                    var frmPnl = btn.ownerCt.ownerCt;
                    var frm = frmPnl.getForm();
                    if (!frm.isValid()) {
                        Ext.Msg.alert('Ошибка заполнения', 'Форма заполнена не верно');
                        return false;
                    }

                    frm.submit({
                        success: function () {
                            frmPnl.hide();
                            frmPnl.successCreateHandler();
                            Ext.destroy(frmPnl);
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
                    })
                }
            }, {
                text: 'Отмена',
                handler: function (btn) {
                    Ext.destroy(btn.ownerCt.ownerCt);
                }
            }]
        });
        App.form.CreateTask.superclass.initComponent.call(this);
    }
});

Ext.reg('app-form-create-task', App.form.CreateTask);
