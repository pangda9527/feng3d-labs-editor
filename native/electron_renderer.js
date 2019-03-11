const { ipcRenderer } = require('electron')

/**
 * 选择文件夹窗口
 * 
 * @param {event:Event,path:string} callback 
 */
function selectDirectoryDialog(callback)
{
    ipcRenderer.once('selected-directory', callback);
    ipcRenderer.send('open-file-dialog');
}

exports.selectDirectoryDialog = selectDirectoryDialog;