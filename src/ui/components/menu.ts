namespace feng3d.editor
{
    export type MenuItem = { label?: string, accelerator?: string, role?: string, type?: 'separator', click?: () => void, submenu?: MenuItem[] };
    export type Menu = MenuItem[];

    export var menu = {
        popup: popup,
    };

    function popup(menu: Menu, mousex?: number, mousey?: number, width = 150)
    {
        var list = new eui.List();
        list.itemRenderer = MenuItemRenderer;
        var dataProvider = new eui.ArrayCollection();
        dataProvider.replaceAll(menu);
        list.x = mousex || windowEventProxy.clientX;
        list.y = mousey || windowEventProxy.clientY;
        if (width !== undefined)
            list.width = width;
        editorui.popupLayer.addChild(list);
        list.dataProvider = dataProvider;

        setTimeout(function ()
        {
            editorui.stage.once(egret.MouseEvent.CLICK, onStageClick, null);
        }, 1);

        function onStageClick()
        {
            editorui.popupLayer.removeChild(list);
        }
    }

    // let template = [{
    //     label: 'Edit',
    //     submenu: [{
    //         label: 'Undo',
    //         accelerator: 'CmdOrCtrl+Z',
    //         role: 'undo'
    //     }, {
    //         label: 'Redo',
    //         accelerator: 'Shift+CmdOrCtrl+Z',
    //         role: 'redo'
    //     }, {
    //         type: 'separator'
    //     }, {
    //         label: 'Cut',
    //         accelerator: 'CmdOrCtrl+X',
    //         role: 'cut'
    //     }, {
    //         label: 'Copy',
    //         accelerator: 'CmdOrCtrl+C',
    //         role: 'copy'
    //     }, {
    //         label: 'Paste',
    //         accelerator: 'CmdOrCtrl+V',
    //         role: 'paste'
    //     }, {
    //         label: 'Select All',
    //         accelerator: 'CmdOrCtrl+A',
    //         role: 'selectall'
    //     }]
    // }, {
    //     label: 'View',
    //     submenu: [{
    //         label: 'Reload',
    //         accelerator: 'CmdOrCtrl+R',
    //         click: function (item, focusedWindow)
    //         {
    //             if (focusedWindow)
    //             {
    //                 // on reload, start fresh and close any old
    //                 // open secondary windows
    //                 if (focusedWindow.id === 1)
    //                 {
    //                     BrowserWindow.getAllWindows().forEach(function (win)
    //                     {
    //                         if (win.id > 1)
    //                         {
    //                             win.close()
    //                         }
    //                     })
    //                 }
    //                 focusedWindow.reload()
    //             }
    //         }
    //     }, {
    //         label: 'Toggle Full Screen',
    //         accelerator: (function ()
    //         {
    //             if (process.platform === 'darwin')
    //             {
    //                 return 'Ctrl+Command+F'
    //             } else
    //             {
    //                 return 'F11'
    //             }
    //         })(),
    //         click: function (item, focusedWindow)
    //         {
    //             if (focusedWindow)
    //             {
    //                 focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
    //             }
    //         }
    //     }, {
    //         label: 'Toggle Developer Tools',
    //         accelerator: (function ()
    //         {
    //             if (process.platform === 'darwin')
    //             {
    //                 return 'Alt+Command+I'
    //             } else
    //             {
    //                 return 'Ctrl+Shift+I'
    //             }
    //         })(),
    //         click: function (item, focusedWindow)
    //         {
    //             if (focusedWindow)
    //             {
    //                 focusedWindow.toggleDevTools()
    //             }
    //         }
    //     }, {
    //         type: 'separator'
    //     }, {
    //         label: 'App Menu Demo',
    //         click: function (item, focusedWindow)
    //         {
    //             if (focusedWindow)
    //             {
    //                 const options = {
    //                     type: 'info',
    //                     title: 'Application Menu Demo',
    //                     buttons: ['Ok'],
    //                     message: 'This demo is for the Menu section, showing how to create a clickable menu item in the application menu.'
    //                 }
    //                 electron.dialog.showMessageBox(focusedWindow, options, function () { })
    //             }
    //         }
    //     }]
    // }, {
    //     label: 'Window',
    //     role: 'window',
    //     submenu: [{
    //         label: 'Minimize',
    //         accelerator: 'CmdOrCtrl+M',
    //         role: 'minimize'
    //     }, {
    //         label: 'Close',
    //         accelerator: 'CmdOrCtrl+W',
    //         role: 'close'
    //     }, {
    //         type: 'separator'
    //     }, {
    //         label: 'Reopen Window',
    //         accelerator: 'CmdOrCtrl+Shift+T',
    //         enabled: false,
    //         key: 'reopenMenuItem',
    //         click: function ()
    //         {
    //             app.emit('activate')
    //         }
    //     }]
    // }, {
    //     label: 'Help',
    //     role: 'help',
    //     submenu: [{
    //         label: 'Learn More',
    //         click: function ()
    //         {
    //             electron.shell.openExternal('http://electron.atom.io')
    //         }
    //     }]
    // }]
}