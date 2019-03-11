const { ipcMain, dialog } = require('electron')

ipcMain.on('open-file-dialog', (event) =>
{
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, (files) =>
        {
            event.sender.send('selected-directory', files[0])
        });
})
