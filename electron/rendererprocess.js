var ipc = require('electron').ipcRenderer;
var shell = require('electron').shell;

var callbackautoid = 0;
var callbacks = {};

function call(id, param)
{
    var callbackid = callbackautoid++;
    callbacks[callbackid] = param && param.callback;
    ipc.send("electron", id, callbackid, param && param.param);
}

function showItemInFolder(fullPath)
{
    return shell.showItemInFolder(fullPath);
}

ipc.on("electron", (e, id, callbackid, param) =>
{
    var callback = callbacks[callbackid];
    callback && callback(param);
    delete callbacks[callbackid];
});

exports.electron = { call: call, showItemInFolder: showItemInFolder };