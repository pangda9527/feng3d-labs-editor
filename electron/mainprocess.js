var ipc = require('electron').ipcMain;
var dialog = require('electron').dialog;
var fs = require("fs-extra");
//
var process = require('child_process');

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
    'createproject': function (param, send)
    {
        var path = param.path;
        fs.copy("feng3d-editor/template", path, { overwrite: true }, (err) =>
        {
            send();
        });
    },
    'initproject': function (param, send)
    {
        var childProcess = process.exec('tsc -w -p ' + param.path, function (error, stdout, stderr)
        {
            if (error !== null)
            {
                console.log('exec error: ' + error);
            }
            console.log(stdout)
            console.log(stderr)
        });
        childProcess.stdout.on('data', function (data)
        {
            data = data.trim();
            console.log(data);
        });
        childProcess.stderr.on('data', function (data)
        {
            data = data.trim();
            console.error(data);
        });
    },
};


