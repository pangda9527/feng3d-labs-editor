const { ipcMain, dialog, WebContents } = require('electron')

ipcMain.on('open-file-dialog', (event) =>
{
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, (files) =>
        {
            event.sender.send('selected-directory', files[0])
        });
});

ipcMain.on('openDevTools', (event) =>
{
    if (event && event.sender)
        event.sender.openDevTools();
});