var ipc = require('electron').ipcMain;
var dialog = require('electron').dialog;

ipc.on("electron", (e, id, callbackid, param) =>
{
    handles[id] && handles[id](param, (result) =>
    {
        e.sender.send('electron', id, callbackid, result);
    });
});

var handles = {
    'selected-file': (param, send) =>
    {
        dialog.showOpenDialog(
            {
                properties: ['openFile'], filters: [
                    param
                ]
            }, function (files)
            {
                send(files && files[0]);
            });
    },
    'selected-directory': function (param, send)
    {
        dialog.showOpenDialog(
            {
                title: param && param.title,
                properties: ['openFile', 'openDirectory']
            }, function (files)
            {
                send(files && files[0]);
            });
    },
};


