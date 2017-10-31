"use strict";

var electron = require("electron");
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;

app.commandLine.appendSwitch('enable-unsafe-es3-apis');
app.on("ready", function ()
{
    //ico--package
    //webPreferences:Settings of web page’s features
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            webSecurity: true
        },
        width: 800, height: 600, minWidth: 800, minHeight: 600
    });
    mainWindow.loadURL("file://" + __dirname + "/index.html");
    mainWindow.webContents.openDevTools();
    // console.log('app.ready:...chrome=', process.versions['chrome'], process.versions['v8']);
});

require("./electron/mainprocess.js");